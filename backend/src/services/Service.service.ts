import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { ServiceDto, UpdageServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>,private readonly exceptions:TypeORMExceptions ) {
    
  }

  async findAll(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({ relations: { client: true } }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }

  async findOne(serviceId: number): Promise<ServiceDto|null> {

    var service: ServiceDto = await this.serviceRepository.find({
            where: { serviceId: serviceId },
            relations: { 
              client: true,
              serviceDetail:true
            }

        }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        

        return service;

  }

  create(service: EntityService): Promise<ServiceDto> {
    return this.serviceRepository.save(service);
  }


  async update(serviceId: number, entity: UpdageServiceDto): Promise<ServiceDto | null> {
    await this.serviceRepository.update(serviceId, entity);
    return this.serviceRepository.findOneBy({ serviceId })
    
  }
}