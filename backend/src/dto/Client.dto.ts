import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateServiceDto, ServiceDto } from './Service.dto';


export class ClientDto {
   
    @IsOptional()
    @IsNumber()
    clientId: number;
   
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    clientType: string;

    @IsOptional()
    @IsDate()
    registryDate: Date;

    @IsOptional()
    @IsObject()
    service: ServiceDto[];  //@OneToMany(() => EntityService, service => service.serviceId)

}

export class CreateClientDto {
      
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    lastName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Favor de escribir la Dirección es un campo obligatorio.' })
    address: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Favor de escribir el Número Telefónico es un campo obligatorio.' })
    phone: string;

    @IsOptional()
    @IsString()
    @IsEmail({allow_underscores: true}, { message: 'Invalid email address'})
    email: string;

    @IsOptional()
    @IsString()
    clientType: string;

    @IsOptional()
    @IsDate()
    registryDate: Date;

    @IsOptional()
    @IsObject()
    service: CreateServiceDto[];  //@OneToMany(() => EntityService, service => service.serviceId)

    
    @IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })
    enabled: boolean;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {
   
    @IsNumber()
    clientId: number;
}
