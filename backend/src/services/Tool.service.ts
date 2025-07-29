import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityTool } from '../entities/Tool.entity';
import { CreateToolDto, ToolDto, UpdateToolDto } from 'src/dto/Tool.dto';
import { CategoryDto } from 'src/dto/Category.dto';
import { EntityCategory } from '../entities/Category.entity';

@Injectable()
export class ServiceTool {
  constructor(@InjectRepository(EntityTool) private toolRepository: Repository<EntityTool>,
              @InjectRepository(EntityCategory) private categoryRepository: Repository<EntityCategory>) {
    }

  findAll(): Promise<ToolDto[]> {
    return this.toolRepository.find();
  }

  async findOne(toolId: number): Promise<ToolDto|null> {
  const toolExist = await this.toolRepository.findOne({ where: { toolId: toolId } });

    //console.log("ERROR ToolService "+toolExist)
    if (!toolExist) throw new NotFoundException('La herramienta no existe');
    return toolExist;
  }

  async create(tool: CreateToolDto): Promise<ToolDto> {
    console.log(JSON.stringify(tool));
    if(tool.category == null){
      var cat:CategoryDto = await this.categoryRepository.findOneBy({ name: 'general' }).then((result: any) => {
        return result;
      }).catch((error: any) => {
        throw new NotFoundException('La categoria general no existe y niguna categoria fue proveida en el request');
      });

      tool.category = cat;
    }
     console.log(JSON.stringify(tool));
    return this.toolRepository.save(tool);
  }

  async update(toolId: number, entity: UpdateToolDto): Promise<ToolDto | null> {
     await this.toolRepository.update(toolId, entity);
     return this.toolRepository.findOneBy({ toolId })
  }

  /*findAllCat(categoryId: number) {
   return this.toolRepository.find({ where: { categoryId: categoryId } });
  }*/
}