import { Module } from '@nestjs/common';
import { GameShopService } from './game-shop.service';
import { GameShopController } from './game-shop.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GameShopController],
  providers: [GameShopService],
})
export class GameShopModule {}
