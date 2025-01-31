import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameOrderDto } from './dto/create-game-order.dto';

@Injectable()
export class GameShopService {
  private readonly priceList = {
    UC: 0.012, // Price per UC
    DIAMONDS: 0.01, // Price per Diamond
    CP: 0.015, // Price per CP
    'V-BUCKS': 0.008, // Price per V-Buck
  };

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, createGameOrderDto: CreateGameOrderDto) {
    const amount = this.calculateAmount(
      createGameOrderDto.currency,
      createGameOrderDto.quantity,
    );

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

      // Create game order
      const order = await prisma.gameOrder.create({
        data: {
          userId,
          gameType: createGameOrderDto.gameType,
          playerId: createGameOrderDto.playerId,
          amount,
          currency: createGameOrderDto.currency,
          quantity: createGameOrderDto.quantity,
          status: 'PENDING',
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: 'GAME_PURCHASE',
          amount,
          status: 'COMPLETED',
        },
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.gameOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private calculateAmount(currency: string, quantity: number): number {
    return this.priceList[currency] * quantity;
  }
}
