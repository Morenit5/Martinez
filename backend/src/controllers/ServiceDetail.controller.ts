import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { EntityServiceDetail } from 'src/entities/ServiceDetails.entity';

@Controller('servicedetail')
export class ControllerServiceDetail {
  constructor(private readonly serviceDetailService:ServiceDetailService) {}

  @Get()
  findAll(): Promise<EntityServiceDetail[]> {
    return this.serviceDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityServiceDetail|null> {
    return this.serviceDetailService.findOne(+id);
  }

  @Post()
  create(@Body() invoiceDetail: EntityServiceDetail): Promise<EntityServiceDetail> {
    return this.serviceDetailService.create(invoiceDetail);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceDetailService.remove(+id);
  }
}