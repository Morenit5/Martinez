import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { EntityUser } from 'src/entities/User.entity';
//import { EntityUser } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<EntityUser[]> {
    return this.usersService.findAll();
  }

  /*@Get(':id')
  findOne(@Param('id') id: string): Promise<EntityUser|null> {
    return this.usersService.findOne(+id);
  }*/

  @Post()
  create(@Body() user: EntityUser): Promise<EntityUser> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}