import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityCategory } from '../entities/Category.entity';
import { EntityTool } from 'src/entities/Tool.entity';
import { stringify } from 'querystring';
import { json } from 'stream/consumers';

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

  /*async delete(categoryId: string) /*: Promise<undefined>* / 
  {
    await this.categoryRepository.delete(categoryId);
  }*/

  async update(categoryId: string, category: EntityCategory): Promise<UpdateResult> {

    return await this.categoryRepository.update(categoryId, category);
  }

  async patchCategory(categoryId: string, partialCategory: Partial<EntityCategory>) {

    const tools: EntityTool[] = await this.toolRepository.find({ where: [{ categoryId: Number(categoryId) }] }).then((result: any) => {
      // console.log(JSON.stringify(result));
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    if (tools != undefined || tools != null) {
      //console.log(JSON.stringify(tools));

      tools.forEach(async (tool) => {
        //console.log(`Tool : ${tool.categoryId}`);
        var eTool : EntityTool = new EntityTool();
        eTool.categoryId=1;
        await this.toolRepository.update( tool.toolId, eTool);
      });
    }
     return this.categoryRepository.update(categoryId, partialCategory);

  }
}