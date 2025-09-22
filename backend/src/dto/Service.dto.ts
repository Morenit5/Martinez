import { isArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDetailDto, ServiceDetailDto, UpdateServiceDetailDto } from './ServiceDetail.dto';
import { CreateInvoiceDto, InvoiceDto } from './Invoice.dto';
import { ClientDto, CreateClientDto } from './Client.dto';
import { Type } from 'class-transformer';

export class ServiceDto {

    @IsOptional()
    @IsNumber()
    serviceId: number;

    @IsOptional()
    @IsString()
    serviceName: string;


    @IsOptional()
    @IsDate()
    serviceDate: Date;

    @IsOptional()
    @IsObject()
    @Type(()=>InvoiceDto)
    invoice?: InvoiceDto; // @OneToOne(() => EntityInvoice, invoice => invoice.invoiceId)

    @IsOptional()
    @IsString()
    status: string;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsObject()    
    @Type(()=>ClientDto) 
    client: ClientDto; //@ManyToOne(() => EntityClient, client => client.clientId, { onUpdate: "CASCADE" })

    @IsOptional()
    @IsObject() 
    @Type(()=>ServiceDetailDto)
    serviceDetail: ServiceDetailDto[]; //@OneToMany(() => EntityServiceDetail, servicedetail => servicedetail.serviceDetailsId)
  
}

export class CreateServiceDto {
 
    @IsNotEmpty({ message: 'El campo serviceName de Servico  es obligatorio.' })
    @IsString()
    serviceName: string;

    @IsNotEmpty({ message: 'El campo Service Date  es obligatorio.' })
    @IsDate()
    serviceDate: Date;

    @IsOptional()
    @IsObject()
    invoice?: CreateInvoiceDto; // @OneToOne(() => EntityInvoice, invoice => invoice.invoiceId)

    @IsString()
    status: string;
    
    @IsNotEmpty({ message: 'El campo price es obligatorio.' })
    @IsString()
    price: string;

    @IsNotEmpty({ message: 'El campo client es obligatorio.' })
    @IsObject()
    client: CreateClientDto; //@ManyToOne(() => EntityClient, client => client.clientId, { onUpdate: "CASCADE" })

    @IsNotEmpty({ message: 'El campo service detail es obligatorio.' })
    @IsObject()
    serviceDetail: CreateServiceDetailDto[] | UpdateServiceDetailDto[]; //@OneToMany(() => EntityServiceDetail, servicedetail => servicedetail.serviceDetailsId)

    @IsBoolean()
    enabled: boolean;

    @IsBoolean()
    isExtra: boolean;
  
}

export class UpdateServiceDto  extends PartialType(CreateServiceDto) {
 
    serviceId: number;
  
}