import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityCategory } from '../entities/Category.entity';
import { EntityTool } from 'src/entities/Tool.entity';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/dto/Category.dto';
import { UpdateToolDto } from 'src/dto/Tool.dto';

@Injectable()
export class ServiceCategory {
  exceptions: any;
  constructor(@InjectRepository(EntityCategory) private categoryRepository: Repository<EntityCategory>, @InjectRepository(EntityTool) private toolRepository: Repository<EntityTool>) { }

  findAll(): Promise<CategoryDto[]> {
    return this.categoryRepository.find();
  }

  findOne(categoryId: number): Promise<CategoryDto | null> {
    return this.categoryRepository.findOneBy({ categoryId });
  }

  create(category: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryRepository.save(category);
  }

  async update(categoryId: number, category: UpdateCategoryDto): Promise<CategoryDto | null> {
    await this.categoryRepository.update(categoryId, category);
    return this.categoryRepository.findOneBy({categoryId});
  }

  async patchCategory(categoryId: number, partialCategory: Partial<UpdateCategoryDto>): Promise<CategoryDto | null> {

    // verificamos si la categoria cuenta con herramientas relacionadas
    const tools: EntityTool[] = await this.toolRepository.find({where: { category: { categoryId: categoryId, }, }, relations: ["category"],}).then((result: any) => {
      // console.log(JSON.stringify(result));
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    
    //Actualizar las herramientas relacionadas con esta categoria, las pasamos a categoria general
    if (tools != undefined || tools != null) {
      //console.log(JSON.stringify(tools));

      //realizamos un recorrido y actualizamos las herramientas a la categoria GENERAL (1)
      tools.forEach(async (tool) => {
        
        var eTool: UpdateToolDto = new UpdateToolDto();
        eTool.category = new CreateCategoryDto();
        eTool.category.categoryId = 1;
        //actualizamos la herramienta a categoria GENERAL
        await this.toolRepository.update(tool.toolId, eTool);
      });
    }

    await this.categoryRepository.update(categoryId, partialCategory);
    return this.categoryRepository.findOneBy({categoryId}); 

  }
}