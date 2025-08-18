import { IsString, IsNotEmpty, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsString()
    @IsOptional()
    readonly imageUrl?: string;

    @IsMongoId()
    @IsNotEmpty()
    readonly categoryId: string;
}
