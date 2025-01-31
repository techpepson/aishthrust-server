import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { GameShopService } from './game-shop.service';
import { CreateGameOrderDto } from './dto/create-game-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('game-shop')
@UseGuards(JwtAuthGuard)
export class GameShopController {
  constructor(private readonly gameShopService: GameShopService) {}

  @Post('order')
  createOrder(
    @GetUser('id') userId: string,
    @Body() createGameOrderDto: CreateGameOrderDto,
  ) {
    return this.gameShopService.createOrder(userId, createGameOrderDto);
  }

  @Get('orders')
  getUserOrders(@GetUser('id') userId: string) {
    return this.gameShopService.getUserOrders(userId);
  }
}
