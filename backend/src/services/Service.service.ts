import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>) {
    
  }

  findAll(): Promise<EntityService[]> {
    return this.serviceRepository.find();
  }

  findOne(serviceId: number): Promise<EntityService|null> {
    return this.serviceRepository.findOneBy({ serviceId });
  }

  create(service: EntityService): Promise<EntityService> {
    return this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    await this.serviceRepository.delete(id);
  }
}