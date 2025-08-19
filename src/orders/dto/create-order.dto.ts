import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsMongoId({ each: true })
  items: string[];

  @IsNumber()
  @Type(() => Number) // ensures it's treated as number
  totalPrice: number;

  @IsEnum(['pending', 'preparing', 'delivered'])
  @IsOptional()
  status?: string = 'pending';

  @IsEnum(['cash', 'visa'])
  @IsOptional()
  paymentMethod?: string = 'cash';
}
