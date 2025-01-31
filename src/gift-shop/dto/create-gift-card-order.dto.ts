import {
  IsString,
  IsNumber,
  IsEnum,
  IsEmail,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum GiftCardType {
  GOOGLE_PLAY = 'GOOGLE_PLAY',
  APPLE = 'APPLE',
  STEAM = 'STEAM',
  PLAYSTATION = 'PLAYSTATION',
}

export class CreateGiftCardOrderDto {
  @IsEnum(GiftCardType)
  type: GiftCardType;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsEmail()
  email: string;
}
