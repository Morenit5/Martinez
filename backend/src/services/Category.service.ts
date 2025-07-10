import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityCategory } from '../entities/Category.entity';
import { EntityTool } from 'src/entities/Tool.entity';

@Injectable()
export class ServiceCategory {
  exceptions: any;
  constructor(@InjectRepository(EntityCategory) private categoryRepository: Repository<EntityCategory>, @InjectRepository(EntityTool) private toolRepository: Repository<EntityTool>) { }

  findAll(): Promise<EntityCategory[]> {
    return this.categoryRepository.find();
  }

  findOne(categoryId: number): Promise<EntityCategory | null> {
    return this.categoryRepository.findOneBy({ categoryId });
  }

  create(category: EntityCategory): Promise<EntityCategory> {
    return this.categoryRepository.save(category);
  }

  async update(categoryId: string, category: EntityCategory): Promise<UpdateResult> {

    return await this.categoryRepository.update(categoryId, category);
  }

  async patchCategory(categoryId: string, partialCategory: Partial<EntityCategory>) {

    // verificamos si la categoria cuenta con herramientas relacionadas
    const tools: EntityTool[] = await this.toolRepository.find({ where: [{ categoryId: Number(categoryId) }] }).then((result: any) => {
      // console.log(JSON.stringify(result));
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    //si la categoria es diferente o nulla, tiene herramientas relacionadas con categoria
    if (tools != undefined || tools != null) {
      //console.log(JSON.stringify(tools));

      //realizamos un recorrido y actualizamos las herramientas a la categoria GENERAL (1)
      tools.forEach(async (tool) => {
        //console.log(`Tool : ${tool.categoryId}`);
        var eTool: EntityTool = new EntityTool();
        eTool.categoryId = 1;
        //actualizamos la herramienta a categoria GENERAL
        await this.toolRepository.update(tool.toolId, eTool);
      });
    }
    return this.categoryRepository.update(categoryId, partialCategory);

  }
}