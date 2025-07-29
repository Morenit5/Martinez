import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto, InvoiceDto } from './Invoice.dto';


export class InvoiceDetailsDto {
   
    @IsOptional()
    @IsNumber()
    invoiceDetailId: number;

    @IsOptional()
    @IsObject()
    invoice: InvoiceDto; //@ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId

    @IsOptional()
    @IsString()
    concept: string;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    subtotal: number;
}

export class CreateInvoiceDetailsDto {
   
    @IsNotEmpty({ message: 'El campo invoiceId es obligatorio.' })
    @IsObject()
    invoice: CreateInvoiceDto; //@ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId, { onUpdate: "CASCADE" })
  
    @IsNotEmpty({ message: 'Escribe la información de los conceptos*.' })
    @IsString()
    concept: string;

    @IsNotEmpty({ message: 'Escribe la información del price' })
    @IsNumber()
    price: number;

    @IsNotEmpty({ message: 'El campo cantidad es obligatorio.' })
    @IsNumber()
    quantity: number;

    @IsNotEmpty({ message: 'El campo subtotal es obligatorio.' })
    @IsNumber()
    subtotal: number;

    @IsBoolean()
    enabled: boolean;
}

export class UpdateInvoiceDetailsDto  extends PartialType(CreateInvoiceDetailsDto) {
   
    invoiceDetailId: number;

}