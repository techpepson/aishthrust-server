import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class TopUpWalletDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
