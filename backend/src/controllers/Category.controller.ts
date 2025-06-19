import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';

@Controller('category')
export class ControllerCategory {
  constructor(private readonly serviceCategory: ServiceCategory) {}

  @Get()
  findAll(): Promise<EntityCategory[]> {
    return this.serviceCategory.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityCategory|null> {
    return this.serviceCategory.findOne(+id);
  }

  @Post()
  create(@Body() category: EntityCategory): Promise<EntityCategory> {
    return this.serviceCategory.create(category);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceCategory.remove(+id);
  }
}