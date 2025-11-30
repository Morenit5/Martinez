import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { EntityUser } from 'src/entities/User.entity';
import { CreateUserLoginDto, userDto } from 'src/dto/User.dto';
//import { EntityUser } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(){}
  /*: Promise<userDto[]> {
    return this.usersService.findAll();
  }*/

  /*@Get(':id')
  findOne(@Param('id') id: string): Promise<EntityUser|null> {
    return this.usersService.findOne(+id);
  }*/

  @Post()
  create(@Body() user: CreateUserLoginDto){}
  /*: Promise<userDto> {
    return this.usersService.create(user);
  }*/

  @Delete(':id')
  remove(@Param('id') id: string){}
  /*: Promise<void> {
    return this.usersService.remove(+id);
  }*/
}