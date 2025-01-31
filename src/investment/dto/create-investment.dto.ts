import { IsNumber, IsPositive, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestmentDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @IsIn([31, 61])
  @Type(() => Number)
  duration: number;
}
