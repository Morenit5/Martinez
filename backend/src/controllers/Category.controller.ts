import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, NotFoundException, InternalServerErrorException, ParseIntPipe, Patch } from '@nestjs/common';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceTool } from 'src/services/Tool.service';

@Controller('category')
export class ControllerCategory {
  newCategory: EntityCategory;
  newPartialCategory : Partial<EntityCategory>;
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
  async create(@Body() category: EntityCategory) {

    try {
      this.newCategory = category;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceCategory.create(this.newCategory)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

    /*if (error.code === '23505') {
        throw new BadRequestException('Categoría duplicada.');
      }
    return this.serviceCategory.create(category);*/
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

  /*Deshabilitar la categoria*/
  @Patch(':id')
  async patchCategory(@Param('id') categoryId: string, @Body() partialCategory: Partial<EntityCategory>) {

    //console.log("ESTO LLEGA "+ categoryId + " " + JSON.stringify(partialCategory));
    try {
      this.newPartialCategory = partialCategory;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceCategory.patchCategory(categoryId, this.newPartialCategory)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
   
  /*@Delete(':id') // Este metodo no se usara
  async remove(@Param('id') categoryId: string)
  {
    console.log("si entra aqui" + categoryId);
     try
     {
      await this.serviceCategory.delete(categoryId); // También puedes usar `remove(entity)` si lo necesitas
      return `Categoria ${categoryId} eliminada correctamente`;

    } catch (error){
      console.error('Error al eliminar categoria:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al eliminar la categoria');
    }
  }*/
}