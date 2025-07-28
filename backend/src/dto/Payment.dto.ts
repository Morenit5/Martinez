import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateInvoiceDto, InvoiceDto } from './Invoice.dto';


export class PaymentDto {

    @IsOptional()
    @IsNumber()
    paymentId: number;

    @IsOptional()
    @IsDate()
    paymentDate: Date;

    @IsOptional()
    @IsNumber()
    paymentAmount: number;

    @IsOptional()
    @IsString()
    paymentMethod: string;

    @IsOptional()
    @IsObject()
    invoice: InvoiceDto; //@ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId, { onUpdate: "CASCADE" })

    @IsOptional()
    @IsNumber()
    taxAmount: number;

    @IsOptional()
    @IsString()
    paymentStatus: string;

}

export class CreatePaymentDto {

    @IsNotEmpty({message: 'El campo paymentDate es obligatorio'})
    @IsDate()
    paymentDate: Date;

    @IsNotEmpty({message: 'El campo paymentAmount es obligatorio'})
    @IsNumber()
    paymentAmount: number;

    @IsNotEmpty({message: 'El campo paymentMethod es obligatorio'})
    @IsString()
    paymentMethod: string;

    @IsNotEmpty({message: 'El campo invoice es obligatorio'})
    @IsObject()
    invoice: CreateInvoiceDto; //@ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId, { onUpdate: "CASCADE" })

    @IsNumber()
    taxAmount: number;

    @IsNotEmpty({message: 'El campo paymentStatus es obligatorio'})
    @IsString()
    paymentStatus: string;

    @IsBoolean()
    enabled: boolean;    

}

export class UpdatePaymentDto  extends PartialType(CreatePaymentDto) {

    paymentId: number;

}

