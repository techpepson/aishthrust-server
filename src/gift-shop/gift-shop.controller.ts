import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { GiftShopService } from './gift-shop.service';
import { CreateGiftCardOrderDto } from './dto/create-gift-card-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('gift-shop')
@UseGuards(JwtAuthGuard)
export class GiftShopController {
  constructor(private readonly giftShopService: GiftShopService) {}

  @Post('order')
  createOrder(
    @GetUser('id') userId: string,
    @Body() createGiftCardOrderDto: CreateGiftCardOrderDto,
  ) {
    return this.giftShopService.createOrder(userId, createGiftCardOrderDto);
  }

  @Get('orders')
  getUserOrders(@GetUser('id') userId: string) {
    return this.giftShopService.getUserOrders(userId);
  }
}
