import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentModule } from './investment/investment.module';
import { GameShopModule } from './game-shop/game-shop.module';
import { GiftShopModule } from './gift-shop/gift-shop.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    InvestmentModule,
    GameShopModule,
    GiftShopModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
