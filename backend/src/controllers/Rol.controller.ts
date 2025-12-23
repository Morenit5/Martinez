import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
//import { CreateUserDto, CreateUserLoginDto, UpdateUserDto, userDto } from '../dto/User.dto';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
//import { ServiceUser } from '../services/User.service';
import { Serializer } from 'src/interceptors/UserTransform.interceptor';
import { ServiceRol } from 'src/services/Rol.service';
import { RolDto } from 'src/dto/Rol.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Serializer(RolDto)
@Controller({ version: '1', path: 'roles' })
export class ControllerRoles {
  

  constructor(private readonly serviceRol: ServiceRol, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<RolDto[]> {
    return this.serviceRol.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RolDto | null> {
    return this.serviceRol.findOne(+id);
  }

}