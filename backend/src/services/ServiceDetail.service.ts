import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityServiceDetail } from '../entities/ServiceDetails.entity';

@Injectable()
export class ServiceDetailService {
  constructor(@InjectRepository(EntityServiceDetail) private serviceDetailRepository: Repository<EntityServiceDetail>) {

  }

  findAll(): Promise<EntityServiceDetail[]> {
    return this.serviceDetailRepository.find();
  }

  findOne(serviceDetailsId: number): Promise<EntityServiceDetail | null> {
    return this.serviceDetailRepository.findOneBy({ serviceDetailsId });
  }

  create(serviceDetail: EntityServiceDetail): Promise<EntityServiceDetail> {
    return this.serviceDetailRepository.save(serviceDetail);
  }

  async delete(id: number): Promise<void> {
    await this.serviceDetailRepository.delete(id);
  }

  async update(serviceDetailId: string, category: EntityServiceDetail): Promise<UpdateResult> {

    return await this.serviceDetailRepository.update(serviceDetailId, category);

  }
}