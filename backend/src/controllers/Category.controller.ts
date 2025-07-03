import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Controller('category')
export class ControllerCategory {
  newCategory: EntityCategory;

  constructor(private readonly serviceCategory: ServiceCategory, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<EntityCategory[]> {
    return this.serviceCategory.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') id: string): Promise<EntityCategory | null> {
    return this.serviceCategory.findOne(+id);
  }

  @Post()
  create(@Body() category: EntityCategory): Promise<EntityCategory> {

    /*if (error.code === '23505') {
        throw new BadRequestException('Categoría duplicada.');
      }*/
    return this.serviceCategory.create(category);
  }

  @Delete(':categoryId')
  remove(@Param('categoryId') id: string): Promise<void> {
    return this.serviceCategory.remove(+id);
  }


  @Put(':id')
  async update(@Param('id') categoryId: string, @Body() category) {

    try {
      this.newCategory = category;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceCategory.update(categoryId, this.newCategory)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

  }

}