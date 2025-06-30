import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EntityUser } from 'src/entities/User.entity';
import { ServiceUser } from 'src/services/User.service';

@Controller('user')
export class  ControllerUser {
  constructor(private readonly serviceUser: ServiceUser) {}

  @Get()
  findAll(): Promise<EntityUser[]> {
    return this.serviceUser.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityUser|null> {
    return this.serviceUser.findOne(+id);
  }

  @Post()
  create(@Body() user: EntityUser): Promise<EntityUser> {
    return this.serviceUser.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceUser.remove(+id);
  }
}