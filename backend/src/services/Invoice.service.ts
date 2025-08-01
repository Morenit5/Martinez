import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityInvoice } from '../entities/Invoice.entity';
import { CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto } from 'src/dto/Invoice.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Injectable()
export class ServiceInvoice {
  constructor(@InjectRepository(EntityInvoice) private invoiceRepository: Repository<EntityInvoice>,private readonly exceptions:TypeORMExceptions) {
    
  }

  findAll(): Promise<InvoiceDto[]> {
    var invoices = this.invoiceRepository.find({ 
      relations: {
        service:{
          serviceDetail:true,
          client:true
        },
        payment:true,
        invoiceDetails:true
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return invoices;
  }

  findOne(invoiceId: number): Promise<InvoiceDto|null> {
    var invoice = this.invoiceRepository.find({ 
      where: { invoiceId: invoiceId },
      relations: {
        service:{
          serviceDetail:true,
          client:true
        },
        payment:true,
        invoiceDetails:true
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return invoice;
  }

  create(invoice: CreateInvoiceDto): Promise<InvoiceDto> {
    return this.invoiceRepository.save(invoice);
  }

  async delete(id: number): Promise<void> {
    await this.invoiceRepository.delete(id);
  }

  async update(invoiceId: number, entity: UpdateInvoiceDto): Promise<InvoiceDto | null> {
    await this.invoiceRepository.update(invoiceId, entity);
    return this.invoiceRepository.findOneBy({ invoiceId });
  }
}