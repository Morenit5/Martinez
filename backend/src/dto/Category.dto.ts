import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateToolDto, ToolDto } from './Tool.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';


export class CategoryDto {

    @IsOptional()
    @IsNumber()
    categoryId: number;
    
    @IsOptional()
    @IsString()
    categoryType: string;

    @IsOptional()
    @IsString()
    name: string;

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