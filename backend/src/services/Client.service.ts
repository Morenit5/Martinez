import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityClient } from '../entities/Client.entity';

@Injectable()
export class ServiceClient {
  constructor(@InjectRepository(EntityClient) private clientRepository: Repository<EntityClient>) {
    
  }

  findAll(): Promise<EntityClient[]> {
    return this.clientRepository.find();
  }

  findOne(clientId: number): Promise<EntityClient|null> {
    return this.clientRepository.findOneBy({ clientId });
  }

  create(client: EntityClient): Promise<EntityClient> {
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}