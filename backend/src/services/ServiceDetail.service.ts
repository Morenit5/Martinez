import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityServiceDetail } from '../entities/ServiceDetails.entity';
import { CreateServiceDetailDto, ServiceDetailDto, UpdateServiceDetailDto } from 'src/dto/ServiceDetail.dto';

@Injectable()
export class ServiceDetailService {
  constructor(@InjectRepository(EntityServiceDetail) private serviceDetailRepository: Repository<EntityServiceDetail>) {

  }

  findAll(): Promise<ServiceDetailDto[]> {
    return this.serviceDetailRepository.find();
  }

  findOne(serviceDetailsId: number): Promise<ServiceDetailDto | null> {
    return this.serviceDetailRepository.findOneBy({ serviceDetailsId });
  }

  create(serviceDetail: CreateServiceDetailDto): Promise<ServiceDetailDto> {
    return this.serviceDetailRepository.save(serviceDetail);
  }

  async delete(id: number): Promise<void> {
    await this.serviceDetailRepository.delete(id);
  }

  async update(serviceDetailsId: number, category: UpdateServiceDetailDto): Promise<ServiceDetailDto | null> {

    await this.serviceDetailRepository.update(serviceDetailsId, category);
    return this.serviceDetailRepository.findOneBy({ serviceDetailsId });

  }
}