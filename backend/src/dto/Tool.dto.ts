
import { IsBoolean, IsNotEmpty, IsNumber, IsString,IsDate, IsOptional } from 'class-validator';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './Category.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';


export class ToolDto {

    @Exclude()
    @IsOptional()
    @IsNumber()
    toolId?: number;

    @Expose()
    @IsOptional()
    name: string;

    @Expose()
    @IsOptional()
    @IsString()
    code: string;

    @Expose()
    @IsOptional()
    @IsString()
    image?: string;

    @Expose()
    @IsOptional()
    @IsString()
    category?: CategoryDto; //@ManyToOne => category.categoryId
 
    @Expose()
    @IsOptional()
    @IsString()
    status: string;

    @Expose()
    @IsOptional()
    @IsString()
    toolState: string;

    @Expose()
    @IsOptional()
    @IsString()
    prize?: number;

    @Expose()
    @IsOptional()
    @IsString()
    acquisitionDate?: Date;

  
}

export class CreateToolDto {

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @IsNotEmpty({ message: 'El código es obligatorio.' })
    code: string; //Podemos generar uno aleatorio? 

    @IsOptional()
    @IsString()
    image?: string; //podemos poner una imagen por defecto en caso que no se provea una

   
    @IsNotEmpty({ message: 'El campo Categoria es obligatorio.' })
    category: CreateCategoryDto | UpdateCategoryDto | CategoryDto; //@ManyToOne => category.categoryId

    @IsNotEmpty({ message: 'El estatus es obligatorio.' })
    status: string; //activa, en reparacion, retirada

    @IsNotEmpty({ message: 'El estatus de la herramienta es obligatorio.' })
    toolState: string; //buena, mala, en mantenimiento

    @IsOptional()
    @IsString()
    prize?: number;

    @IsOptional()
    @IsDate()
    acquisitionDate?: Date;

    @IsBoolean()
    enabled: true;
}

export class UpdateToolDto  extends PartialType(CreateToolDto) {

    @IsNumber()
    toolId: number;
   
}