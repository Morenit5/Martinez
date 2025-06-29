import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  update(categoryId: string, category: EntityCategory) {

     let cualquieraServices: any = '';
    try
    {
      cualquieraServices = this.categoryRepository.update(categoryId, category);
      //return this.categoryRepository.update(categoryId, category);

      cualquieraServices.then((value) => {
        console.log(value); // Logs "Data from Promise" after 1 second
      });

      return cualquieraServices;
    }
    catch(error)
    {
      console.log("Atrapando la calabaceada :D en el service ");
      console.log(error);
      return error;
    }
    
  }

}