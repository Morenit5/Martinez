import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { PermissionDto } from 'src/dto/Permission.dto';
import { ServicePermission } from 'src/services/Permission.service';


@Controller({ version: '1', path: 'perms' })
export class ControllerPermission {
  

  constructor(private readonly servicePermission: ServicePermission, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<PermissionDto[]> {
    return this.servicePermission.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PermissionDto | null> {
    return this.servicePermission.findOne(+id);
  }

  

  
}