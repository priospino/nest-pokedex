import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    //@Type(() => Number) // 🔥 Esto transforma el string a number
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    //@Type(() => Number) // 🔥 Esto transforma el string a number
    offset?: number;

}