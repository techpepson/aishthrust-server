import { Module } from '@nestjs/common';
import { GiftShopService } from './gift-shop.service';
import { GiftShopController } from './gift-shop.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiftShopController],
  providers: [GiftShopService],
})
export class GiftShopModule {}
