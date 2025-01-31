import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paystackService: PaystackService,
  ) {}

  async topUpWallet(userId: string, topUpDto: TopUpWalletDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    const initializeResponse = await this.paystackService.initializeTransaction(
      user.email,
      topUpDto.amount,
    );

    // Save the pending transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'WALLET_TOPUP',
        amount: topUpDto.amount,
        status: 'PENDING',
        // reference: initializeResponse.reference,
      },
    });

    return {
      authorization_url: initializeResponse.authorization_url,
      reference: initializeResponse.reference,
    };
  }

  async verifyPayment(reference: string) {
    const verification =
      await this.paystackService.verifyTransaction(reference);

    if (verification.status === 'success') {
      const transaction = await this.prisma.transaction.findFirst({
        where: { reference },
      });

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      await this.prisma.$transaction(async (prisma) => {
        // Update transaction status
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' },
        });

        // Update user balance
        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        });
      });

      return { message: 'Payment verified successfully' };
    }

    throw new BadRequestException('Payment verification failed');
  }

  async create(userId: string, createInvestmentDto: CreateInvestmentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const userBalance = new Decimal(user.balance);
    const investmentAmount = new Decimal(createInvestmentDto.amount);

    if (userBalance.lessThan(investmentAmount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Calculate returns based on investment duration
    let dailyReturnPercentage: number;
    if (createInvestmentDto.duration === 31) {
      dailyReturnPercentage = 0.04; // 4% daily return for 31 days
    } else if (createInvestmentDto.duration === 61) {
      dailyReturnPercentage = 0.03; // 3% daily return for 61 days
    } else {
      throw new BadRequestException(
        'Invalid investment duration. Choose either 31 or 61 days.',
      );
    }

    const dailyReturn = investmentAmount.mul(dailyReturnPercentage);
    const totalReturn = dailyReturn.mul(createInvestmentDto.duration);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + createInvestmentDto.duration);

    // Start transaction
    const investment = await this.prisma.$transaction(async (prisma) => {
      // Deduct amount from user balance
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: investmentAmount,
          },
        },
      });

      // Create investment record
      const investment = await prisma.investment.create({
        data: {
          userId,
          amount: investmentAmount,
          dailyReturn,
          duration: createInvestmentDto.duration,
          totalReturn,
          status: 'ACTIVE',
          endDate,
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: 'INVESTMENT',
          amount: investmentAmount,
          status: 'COMPLETED',
        },
      });

      return investment;
    });

    return investment;
  }

  async getUserInvestments(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processInvestmentReturns() {
    const activeInvestments = await this.prisma.investment.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    for (const investment of activeInvestments) {
      await this.prisma.$transaction(async (prisma) => {
        // Add daily return to user balance
        await prisma.user.update({
          where: { id: investment.userId },
          data: {
            balance: {
              increment: investment.dailyReturn,
            },
          },
        });

        // Create transaction record for the return
        await prisma.transaction.create({
          data: {
            userId: investment.userId,
            type: 'INVESTMENT_RETURN',
            amount: investment.dailyReturn,
            status: 'COMPLETED',
          },
        });
      });
    }
  }
}
