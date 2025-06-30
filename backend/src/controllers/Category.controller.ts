import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';

@Controller('category')
export class ControllerCategory {
  constructor(private readonly serviceCategory: ServiceCategory) { }

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
  // a ver si está bien :(
  @Put(':id')
  update(@Param('id') categoryId: string, @Body() category /*: EntityCategory*/) {

    // como recibimos el objeto
    /*console.log(categoryId); // SI NO ES OBJETO NO SE CONVIERTE, SE PONEN DIRECTAMENTE
    //console.log(JSON.stringify(category)); //SI ES UN OBJETO LO CONVERTIMOS EN JASON*/

    let bObjeto: any = '';
    //let newCategory: EntityCategory = category;
    try
    {
      let newCategory: EntityCategory = category;
      //return this.serviceCategory.update(categoryId, newCategory);
      bObjeto = this.serviceCategory.update(categoryId, newCategory);
      console.log(bObjeto);
      bObjeto.then((value) => { console.log(value); /* Logs "Data from Promise" after 1 second*/ });
    }
    catch (error)
    {
      //verificamos si el cuerpo se encuentra vacio 
      if (bObjeto.affected === 0) { throw new NotFoundException('Categoría ${id} no existe'); }
      //record inexistente //no hay record para actualizar porque no existe
      if (!bObjeto) { throw new NotFoundException('Categoría con ${id} no encontrada'); }
      // el valor a cotejar es de otro tipo al esperado
      if(bObjeto != category) { throw new NotFoundException('La Categoría ${id} no puede ser actualizada.'); }
      console.log(error);
    }
    return bObjeto;
  }
}