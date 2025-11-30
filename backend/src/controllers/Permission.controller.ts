import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { PermissionDto } from 'src/dto/Permission.dto';
import { ServicePermission } from 'src/services/Permission.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'perms' })
export class ControllerPermission {
  

  constructor(private readonly servicePermission: ServicePermission, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<PermissionDto[]> {
    return this.servicePermission.findAll();
  }

  @Get('/r/:id')
  findAllByRol(@Param('id') id: number): Promise<PermissionDto | null> {
    return this.servicePermission.findAllByRol(id);
  }

  

  
}