import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityInvoiceDetails } from '../entities/InvoiceDetails.entity';

@Injectable()
export class ServiceInvoiceDetail {
  constructor(@InjectRepository(EntityInvoiceDetails) private invoiceDetailRepository: Repository<EntityInvoiceDetails>) {
  }

  findAll(): Promise<EntityInvoiceDetails[]> {
    return this.invoiceDetailRepository.find();
  }

  findOne(invoiceDetailId: number): Promise<EntityInvoiceDetails|null> {
    return this.invoiceDetailRepository.findOneBy({ invoiceDetailId });
  }

  create(invoiceDetail: EntityInvoiceDetails): Promise<EntityInvoiceDetails> {
    return this.invoiceDetailRepository.save(invoiceDetail);
  }

  async delete(id: number): Promise<void> {
    await this.invoiceDetailRepository.delete(id);
  }

  async update(id: string, entity: EntityInvoiceDetails): Promise<UpdateResult> {
    return await this.invoiceDetailRepository.update(id, entity);
  }
}