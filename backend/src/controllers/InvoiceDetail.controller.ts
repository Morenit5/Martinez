import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceInvoiceDetail } from 'src/services/InvoiceDetails.service';
import { EntityInvoiceDetails } from 'src/entities/InvoiceDetails.entity';

@Controller('invoiceDetail')
export class ControllerInvoiceDetail {
  constructor(private readonly serviceDetailService: ServiceInvoiceDetail) {}

  @Get()
  findAll(): Promise<EntityInvoiceDetails[]> {
    return this.serviceDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityInvoiceDetails|null> {
    return this.serviceDetailService.findOne(+id);
  }

  @Post()
  create(@Body() detfact: EntityInvoiceDetails): Promise<EntityInvoiceDetails> {
    return this.serviceDetailService.create(detfact);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceDetailService.remove(+id);
  }
}