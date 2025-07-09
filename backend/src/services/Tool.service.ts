import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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

  async delete(id: number): Promise<void> {
    await this.toolRepository.delete(id);
  }

  async update(id: string, entity: EntityTool): Promise<UpdateResult> {
    return await this.toolRepository.update(id, entity);
  }

  findAllCat(categoryId: number) {
   return this.toolRepository.find({ where: { categoryId: categoryId } });
    //return this.toolRepository.find();
  }
}