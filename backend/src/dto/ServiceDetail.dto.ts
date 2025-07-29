
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateServiceDto, ServiceDto } from './Service.dto';


export class ServiceDetailDto {
   
    @IsOptional()
    @IsNumber()
    serviceDetailsId: number;

    @IsOptional()
    @IsObject()
    service: ServiceDto; //@ManyToOne service => service.serviceId,

    @IsOptional()
    @IsString()
    serviceType: string;

    
    @IsOptional()
    @IsString()
    description: string;

    
    @IsOptional()
    @IsNumber()
    unitMeasurement: number; // unidad de medida litros, metros, piezas

    
    @IsOptional()
    @IsNumber()
    quantity: number; // la cantidad que se uso de cada servicio

    @IsOptional()
    @IsNumber()
    price: number;

}

export class CreateServiceDetailDto {
   
    service: CreateServiceDto; //@ManyToOne service => service.serviceId,

    @IsNotEmpty({ message: 'El tipo del servicio es obligatorio.' })
    serviceType: string;

    @IsNotEmpty({ message: 'La descripcion del servicio es obligatorio.' })
    description: string;

    
    @IsNotEmpty({ message: 'La unidad de medida del servicio es requerida.' })
    @IsNumber()
    unitMeasurement: number; // unidad de medida litros, metros, piezas

    
    @IsNotEmpty({ message: 'La cantidad es requerida.' })
    @IsNumber()
    quantity: number; // la cantidad que se uso de cada servicio

    @IsNotEmpty({ message: 'El campo precio es requerido' })
    @IsNumber()
    price: number;

    @IsBoolean()
    enabled: boolean;
}

export class UpdateServiceDetailDto extends PartialType(CreateServiceDetailDto) {
   
    serviceDetailsId: number;

   
}