
import {  IsNumber, IsOptional, IsString } from 'class-validator';



export class ConfigurationDto {
   
    @IsOptional()
    @IsNumber()
    configurationId: number;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    isInvoiceAutomatically: boolean;


    @IsOptional()
    @IsString()
    enableNotification: boolean; //notificaciones para los clientes antes que se venza la factura

    @IsOptional()
    @IsString()
    enableOnDate: number; //en que dia se mandara la notificacion para los clientes antes que se venza la factura


    @IsOptional()
    @IsString()   
    licenseNumber: string;

   @IsOptional()
    @IsString()
    enabled: boolean;

}

export class createConfigurationDto {
   
    @IsOptional()
    @IsNumber()
    configurationId: number;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    isInvoiceAutomatically: boolean;

    @IsOptional()
    @IsString()
    enableNotification: boolean;

    @IsOptional()
    @IsString()
    enableOnDate: number;

    @IsOptional()
    @IsString()   
    licenseNumber: string;

   @IsOptional()
    @IsString()
    enabled: boolean;

}





