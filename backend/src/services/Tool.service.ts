import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(toolId: number): Promise<EntityTool|null> {
  const toolExist = await this.toolRepository.findOne({ where: { toolId: toolId } });

    //console.log("ERROR ToolService "+toolExist)
    if (!toolExist) throw new NotFoundException('La herramienta no existe');
    return toolExist;
  }

  create(tool: EntityTool): Promise<EntityTool> {
    return this.toolRepository.save(tool);
  }

  async update(id: string, entity: EntityTool): Promise<UpdateResult> {
    return await this.toolRepository.update(id, entity);
  }

  findAllCat(categoryId: number) {
   return this.toolRepository.find({ where: { categoryId: categoryId } });
  }
}