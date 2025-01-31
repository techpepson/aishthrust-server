import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaystackService } from '../paystack/paystack.service';

@Module({
  imports: [PrismaModule],
  controllers: [InvestmentController],
  providers: [InvestmentService, PaystackService],
})
export class InvestmentModule {}
