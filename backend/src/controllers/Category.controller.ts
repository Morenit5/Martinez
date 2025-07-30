import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/dto/Category.dto';

//@Controller('category')
//@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'category' })
export class ControllerCategory {
  createCat: CreateCategoryDto;
  updateCat: UpdateCategoryDto;
  
  constructor(private readonly serviceCategory: ServiceCategory, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<CategoryDto[]> {
    return this.serviceCategory.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') id: string): Promise<CategoryDto | null> {
    return this.serviceCategory.findOne(+id);
  }

  @Post()
  async create(@Body() category: CreateCategoryDto) : Promise<CategoryDto | null> {

    try {
      this.createCat = category;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceCategory.create(this.createCat)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });


  }

  @Put('/up/:id')
  async update(@Param('id') categoryId: string, @Body() category) : Promise<CategoryDto | null> {

    try {
      this.updateCat = category;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceCategory.update(Number(categoryId), this.updateCat)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  /*Deshabilitar la categoria*/
  @Patch(':id')
  async patchCategory(@Param('id') categoryId: string, @Body() partialCategory: UpdateCategoryDto) : Promise<CategoryDto | null> {

    try {
      this.updateCat = partialCategory;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceCategory.patchCategory(Number(categoryId), this.updateCat)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}