import { IsString, IsNumber, IsEnum, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export enum GameType {
  PUBG = 'PUBG',
  FREE_FIRE = 'FREE_FIRE',
  COD = 'COD',
  FORTNITE = 'FORTNITE',
}

export enum CurrencyType {
  UC = 'UC',
  DIAMONDS = 'DIAMONDS',
  CP = 'CP',
  VBUCKS = 'V-BUCKS',
}

export class CreateGameOrderDto {
  @IsEnum(GameType)
  gameType: GameType;

  @IsString()
  playerId: string;

  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}
