import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceInvoice } from 'src/services/Invoice.service';
import { EntityInvoice } from 'src/entities/Invoice.entity';

@Controller('invoice')
export class  ControllerInvoice {
  constructor(private readonly serviceInvoice: ServiceInvoice) {}

  @Get()
  findAll(): Promise<EntityInvoice[]> {
    return this.serviceInvoice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityInvoice|null> {
    return this.serviceInvoice.findOne(+id);
  }

  @Post()
  create(@Body() invoice: EntityInvoice): Promise<EntityInvoice> {
    return this.serviceInvoice.create(invoice);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceInvoice.remove(+id);
  }
}