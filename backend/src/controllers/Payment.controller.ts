import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServicePayment} from 'src/services/Payment.service';
import { EntityPayment } from 'src/entities/Payment.entity';

@Controller('payment')
export class  ControllerPayment {
  constructor(private readonly servicePayment: ServicePayment) {}

  @Get()
  findAll(): Promise<EntityPayment[]> {
    return this.servicePayment.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityPayment|null> {
    return this.servicePayment.findOne(+id);
  }

  @Post()
  create(@Body() payment: EntityPayment): Promise<EntityPayment> {
    return this.servicePayment.create(payment);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.servicePayment.remove(+id);
  }
}