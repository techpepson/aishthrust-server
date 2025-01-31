import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGiftCardOrderDto } from './dto/create-gift-card-order.dto';

@Injectable()
export class GiftShopService {
  private readonly minimumAmounts = {
    GOOGLE_PLAY: 10,
    APPLE: 10,
    STEAM: 20,
    PLAYSTATION: 10,
  };

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    userId: string,
    createGiftCardOrderDto: CreateGiftCardOrderDto,
  ) {
    const { type, amount } = createGiftCardOrderDto;

    if (amount < this.minimumAmounts[type]) {
      throw new BadRequestException(
        `Minimum amount for ${type} gift card is $${this.minimumAmounts[type]}`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (parseFloat(user.balance.toString()) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Deduct amount from user balance
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Create gift card order
      const order = await prisma.giftCardOrder.create({
        data: {
          userId,
          type,
          amount,
          email: createGiftCardOrderDto.email,
          status: 'PENDING',
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: 'GIFT_CARD_PURCHASE',
          amount,
          status: 'COMPLETED',
        },
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.giftCardOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
