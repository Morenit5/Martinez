import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateToolDto, ToolDto } from './Tool.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';


export class CategoryDto {

    @Expose()
    @IsOptional()
    @IsNumber()
    categoryId: number;
    
    @Expose()
    @IsOptional()
    @IsString()
    categoryType: string;

    @Expose()
    @IsOptional()
    @IsString()
    name: string;

    @Expose()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ToolDto) // Important for nested object validation
    tool?: ToolDto[]; //@OneToMany => tool.categoryId
}

export class CreateCategoryDto {

    @IsOptional()
    @IsNumber()
    categoryId: number;

    @IsNotEmpty({ message: 'El tipo de la categoría es obligatorio.' })
    categoryType: string;

    @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
    name: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    tool?: CreateToolDto[];

    @IsBoolean()
    enabled: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto){

    
}