import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceClient } from 'src/services/Client.service';
import { EntityClient } from 'src/entities/Client.entity';

@Controller('client')
export class  ControllerClient {
  constructor(private readonly ServiceClient: ServiceClient) {}

  @Get()
  findAll(): Promise<EntityClient[]> {
    return this.ServiceClient.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityClient|null> {
    return this.ServiceClient.findOne(+id);
  }

  @Post()
  create(@Body() client: EntityClient): Promise<EntityClient> {
    return this.ServiceClient.create(client);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ServiceClient.remove(+id);
  }
}