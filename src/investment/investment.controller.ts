import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post('top-up')
  topUpWallet(@GetUser('id') userId: string, @Body() topUpDto: TopUpWalletDto) {
    return this.investmentService.topUpWallet(userId, topUpDto);
  }

  @Get('verify-payment/:reference')
  verifyPayment(@Param('reference') reference: string) {
    return this.investmentService.verifyPayment(reference);
  }

  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    return this.investmentService.create(userId, createInvestmentDto);
  }

  @Get()
  getUserInvestments(@GetUser('id') userId: string) {
    return this.investmentService.getUserInvestments(userId);
  }
}
