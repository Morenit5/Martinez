import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityInvoice } from '../entities/Invoice.entity';

@Injectable()
export class ServiceInvoice {
  constructor(@InjectRepository(EntityInvoice) private invoiceRepository: Repository<EntityInvoice>) {
    
  }

  findAll(): Promise<EntityInvoice[]> {
    return this.invoiceRepository.find();
  }

  findOne(invoiceId: number): Promise<EntityInvoice|null> {
    return this.invoiceRepository.findOneBy({ invoiceId });
  }

  create(invoice: EntityInvoice): Promise<EntityInvoice> {
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    await this.invoiceRepository.delete(id);
  }
}