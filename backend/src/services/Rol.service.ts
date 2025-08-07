import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { EntityRol } from 'src/entities/Rol.entity';
import { RolDto } from 'src/dto/Rol.dto';

@Injectable()
export class ServiceRol {
  constructor(@InjectRepository(EntityRol) private rolesRepository: Repository<EntityRol>,private readonly exceptions:TypeORMExceptions) {
  }

  findAll(): Promise<RolDto[]> {
    return this.rolesRepository.find({
      where: [
        { enabled: true },
      ],
    })
  }


  findOne(rolId: number): Promise<RolDto|null> {
    return this.rolesRepository.findOneBy({ rolId });
  }




}