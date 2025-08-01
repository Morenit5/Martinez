import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>,private readonly exceptions:TypeORMExceptions ) {
    
  }

  async findAll(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({ 
      relations: {
        client: true,
        serviceDetail:true,
        invoice: {
          payment:true,
          invoiceDetails:true
        }
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }

  async findOne(serviceId: number): Promise<ServiceDto | null> {

    var service: ServiceDto = await this.serviceRepository.find({
      where: { serviceId: serviceId },
      relations: {
        client: true,
        serviceDetail: true,
        invoice: {
          payment: true,
          invoiceDetails: true
        }
      }
    }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return service;

  }

  create(service: CreateServiceDto): Promise<ServiceDto> {
    return this.serviceRepository.save(service);
  }


  async update(serviceId: number, entity: UpdateServiceDto): Promise<ServiceDto | null> {
    await this.serviceRepository.update(serviceId, entity);
    return this.serviceRepository.findOneBy({ serviceId })
    
  }
}