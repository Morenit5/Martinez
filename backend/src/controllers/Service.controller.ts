import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceService} from 'src/services/Service.service';
import { EntityService } from 'src/entities/Service.entity';

@Controller('service')
export class  ControllerService {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  findAll(): Promise<EntityService[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityService|null> {
    return this.serviceService.findOne(+id);
  }

  @Post()
  create(@Body() service: EntityService): Promise<EntityService> {
    return this.serviceService.create(service);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceService.remove(+id);
  }
}