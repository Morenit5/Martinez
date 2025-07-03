import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityCategory } from '../entities/Category.entity';

@Injectable()
export class ServiceCategory {
  constructor(@InjectRepository(EntityCategory) private categoryRepository: Repository<EntityCategory>) {
    
  }

  findAll(): Promise<EntityCategory[]> {
    return this.categoryRepository.find();
  }

  findOne(categoryId: number): Promise<EntityCategory|null> {
    return this.categoryRepository.findOneBy({ categoryId });
  }

  create(category: EntityCategory): Promise<EntityCategory> {
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async update(categoryId: string, category: EntityCategory): Promise<UpdateResult> {

     return await this.categoryRepository.update(categoryId, category);
     /*.catch(error => {
        //console.error("Ocurrio un error:", error);
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Mensaje customizado del service'
        },
          HttpStatus.FORBIDDEN, {
          cause: error
        }
        );

      });*/

    
  }

}