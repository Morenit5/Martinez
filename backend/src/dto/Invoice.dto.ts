import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNotEmpty, isNumber, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreatePaymentDto, PaymentDto } from './Payment.dto';
import { CreateServiceDto, ServiceDto } from './Service.dto';
import { Type } from 'class-transformer';

export class InvoiceDto {

    @IsOptional()
    @IsNumber()
    invoiceId: number;

    @IsOptional()
    @IsDate()
    invoiceDate: Date;

    @IsOptional()
    @IsString()
    invoicedMonth: string;

    @IsOptional()
    @IsString()
    invoiceName: string;

    @IsOptional()
    @IsString()
    invoiceNumber: string;

    @IsOptional()
    @IsNumber()
    totalAmount: number;

    @IsOptional()
    @IsObject()
    @Type(()=>PaymentDto)
    payment: PaymentDto[];  //@OneToMany(() => EntityPayment, payment => payment.paymentId)
  
    @IsOptional()
    @IsObject()
    @Type(()=> ServiceDto)
    service?: ServiceDto; //@OneToMany(() => EntityService, service => service.serviceId)  
    
    @IsOptional()
    @IsNumber()
    subtotalAmount:number

    @IsOptional()
    @IsString()
    invoiceStatus: string;

    @IsBoolean()
    isGenerated: boolean;
}

export class CreateInvoiceDto {

    @IsDate()
    invoiceDate: Date;

    @IsNotEmpty({ message: 'El campo número de factura es obligatorio.' })
    @IsString()
    invoiceNumber: string;

    @IsOptional()
    @IsString()
    invoiceName: string;

    /*@IsNotEmpty({ message: 'El campo nombre de factura es obligatorio.' })
    @IsString()
    invoiceName: string;*/
    @IsOptional()
    @IsString()
    invoicedMonth: string;

    @IsNotEmpty({ message: 'El campo cantidad total es obligatorio.' })
    @IsNumber()
    totalAmount: number;

    @IsNotEmpty({ message: 'El campo pago es obligatorio.' })
    @IsObject()
    payment: CreatePaymentDto[];  //@OneToMany(() => EntityPayment, payment => payment.paymentId)
   
    @IsOptional()
    @IsObject()
    service?: CreateServiceDto; //@OneToOne(() => EntityService, service => service.serviceId)

    @IsOptional()
    @IsNumber()
    subtotalAmount:number;

    @IsOptional()
    @IsString()
    invoiceStatus: string;

    @IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })
    enabled: boolean;

       
    @IsBoolean()
    isGenerated: boolean;
}

export class UpdateInvoiceDto  extends PartialType(CreateInvoiceDto) {

    @IsOptional()
    @IsNumber()
    invoiceId: number;
}
