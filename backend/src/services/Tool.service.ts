import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityTool } from '../entities/Tool.entity';

@Injectable()
export class ServiceTool {
  constructor(@InjectRepository(EntityTool) private toolRepository: Repository<EntityTool>) {
    
  }

  findAll(): Promise<EntityTool[]> {
    return this.toolRepository.find();
  }

  findOne(toolId: number): Promise<EntityTool|null> {
    return this.toolRepository.findOneBy({ toolId });
  }

  create(tool: EntityTool): Promise<EntityTool> {
    return this.toolRepository.save(tool);
  }

  async remove(id: number): Promise<void> {
    await this.toolRepository.delete(id);
  }
}