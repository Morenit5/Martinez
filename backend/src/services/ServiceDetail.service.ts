import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityServiceDetail } from '../entities/ServiceDetails.entity';

@Injectable()
export class ServiceDetailService {
  constructor(@InjectRepository(EntityServiceDetail) private serviceDetailRepository: Repository<EntityServiceDetail>) {
    
  }

  findAll(): Promise<EntityServiceDetail[]> {
    return this.serviceDetailRepository.find();
  }

  findOne(serviceDetailsId: number): Promise<EntityServiceDetail|null> {
    return this.serviceDetailRepository.findOneBy({ serviceDetailsId });
  }

  create(serviceDetail: EntityServiceDetail): Promise<EntityServiceDetail> {
    return this.serviceDetailRepository.save(serviceDetail);
  }

  async remove(id: number): Promise<void> {
    await this.serviceDetailRepository.delete(id);
  }
}