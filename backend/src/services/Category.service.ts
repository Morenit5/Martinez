import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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
    return this.categoryRepository.find({
      where: [
        { enabled: true },
      ],
    })
  }

  findOne(categoryId: number): Promise<CategoryDto | null> {
    return this.categoryRepository.findOne({
      where: { categoryId: categoryId },
      relations: { tool: true }

    }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });
  }

  async create(category: Partial<CreateCategoryDto>): Promise<CategoryDto | any> {
    // verificamos que la categoria no se encuentre duplicada
    const existingCategory = await this.categoryRepository.findOne({ where: { name: category.name, enabled: false }  });

    if(JSON.stringify(existingCategory).length >0 ) {
      category.categoryId = existingCategory?.categoryId;
      category.enabled= true; // lo habilitamos  
    }

     //de lo contrario no existe en la bd y es registro
    // 2) Intentar guardar y capturar error único de BD
    try {
      const newCategory = this.categoryRepository.create(category);
      return await this.categoryRepository.save(newCategory);
    } catch (e: any) {
      // Postgres
      if (e.code === '23505'){
        throw new BadRequestException('Error: La categoría ya está registrada ');
      }
      else{
        
        throw new BadRequestException(e);
        
      } 
      
    }
  }

  async update(categoryId: number, category: UpdateCategoryDto): Promise<CategoryDto | null> {
    await this.categoryRepository.update(categoryId, category);
    return this.categoryRepository.findOneBy({ categoryId });
  }

  async reactive(categoryId: number, category: CategoryDto ): Promise<CategoryDto | null> {
    await this.categoryRepository.update(categoryId, category);
    return this.categoryRepository.findOneBy({ categoryId });
  }

  async patchCategory(categoryId: number, partialCategory: Partial<UpdateCategoryDto>): Promise<CategoryDto | null> {

    // verificamos si la categoria cuenta con herramientas relacionadas
    const tools: EntityTool[] = await this.toolRepository.find({ where: { category: { categoryId: categoryId, }, }, relations: ["category"], }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    //Actualizar las herramientas relacionadas con esta categoria, las pasamos a categoria general
    if (tools != undefined || tools != null) {
      
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
    return this.categoryRepository.findOneBy({ categoryId });

  }
}