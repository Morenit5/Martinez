import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityInvoiceDetails } from '../entities/InvoiceDetails.entity';
import { CreateInvoiceDetailsDto, InvoiceDetailsDto, UpdateInvoiceDetailsDto } from 'src/dto/InvoiceDetails.dto';

@Injectable()
export class ServiceInvoiceDetail {
  constructor(@InjectRepository(EntityInvoiceDetails) private invoiceDetailRepository: Repository<EntityInvoiceDetails>) {
  }

  findAll(): Promise<InvoiceDetailsDto[]> {
    return this.invoiceDetailRepository.find();
  }

  findOne(invoiceDetailId: number): Promise<InvoiceDetailsDto|null> {
    return this.invoiceDetailRepository.findOneBy({ invoiceDetailId });
  }

  create(invoiceDetail: CreateInvoiceDetailsDto): Promise<InvoiceDetailsDto> {
    return this.invoiceDetailRepository.save(invoiceDetail);
  }

  async delete(id: number): Promise<void> {
    await this.invoiceDetailRepository.delete(id);
  }

  async update(invoiceDetailId: number, entity: UpdateInvoiceDetailsDto): Promise<InvoiceDetailsDto | null> {
    await this.invoiceDetailRepository.update(invoiceDetailId, entity);
    return this.invoiceDetailRepository.findOneBy({ invoiceDetailId });
  }
}