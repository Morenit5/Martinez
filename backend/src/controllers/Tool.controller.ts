import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ServiceTool } from 'src/services/Tool.service';
import { EntityTool } from 'src/entities/Tool.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Controller('tool')
export class ControllerTool {
  newTool: EntityTool;
  constructor(private readonly serviceTool: ServiceTool, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<EntityTool[]> {
    return this.serviceTool.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<EntityTool | null> {

    // puedo eliminar
    //puedo cambiar de categoria
    //deshabilitar la herramienta darle de baja
    return this.serviceTool.findOne(id);
  }

  @Post()
  async create(@Body() tool: EntityTool): Promise<undefined> {

    try {
      this.newTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceTool.create(this.newTool)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  // este metodo es para actualizar la tool junto con su categoryId
  @Put('/up/:id')
  async update(@Param('id') toolId: string, @Body() tool) {

    //buscar por id, nombre, categoria
    try {
      this.newTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceTool.update(toolId, this.newTool)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}