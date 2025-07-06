import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityCategory } from '../entities/Category.entity';

@Injectable()
export class ServiceCategory {
  constructor(@InjectRepository(EntityCategory) private categoryRepository: Repository<EntityCategory>)
  {  }

  findAll(): Promise<EntityCategory[]> {
    return this.categoryRepository.find();
  }

  findOne(categoryId: number): Promise<EntityCategory|null> {
    return this.categoryRepository.findOneBy({ categoryId });
  }

  create(category: EntityCategory): Promise<EntityCategory> {
    return this.categoryRepository.save(category);
  }

  async delete(categoryId: string)/*: Promise<undefined>*/ 
  {
    await this.categoryRepository.delete(categoryId);
  }

  async update(categoryId: string, category: EntityCategory): Promise<UpdateResult> {

     return await this.categoryRepository.update(categoryId, category);    
  }
}