import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
    /*console.log(categoryId); // SI NO ES IBJETO NO SE CONVIERTE, SE PONEN DIRECTAMENTE
    //console.log(JSON.stringify(category)); //SI ES UN OBJETO LO CONVERTIMOS EN JASON*/

    let cualquiera: any = '';
    try {
      let newCategory: EntityCategory = category;

      //return this.serviceCategory.update(categoryId, newCategory);
      cualquiera = this.serviceCategory.update(categoryId, newCategory);
      console.log(cualquiera);

      cualquiera.then((value) => {
        console.log(value); // Logs "Data from Promise" after 1 second
      });
    }
    catch (error) {
//cuerpo vacio 
//record inexistente
//no hay record para actualizar porque no existe
// el valor a cotejar es de otro tipo al esperado


      console.log(error);
    }



    return cualquiera;
  }
}