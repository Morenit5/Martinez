import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ServiceTool } from 'src/services/Tool.service';
import { EntityTool } from 'src/entities/Tool.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CreateToolDto, ToolDto, UpdateToolDto } from 'src/dto/Tool.dto';

//@Controller('tool')
@Controller({ version: '1', path: 'tool' })
export class ControllerTool {
  createTool: CreateToolDto;
  updateTool: UpdateToolDto;
  constructor(private readonly serviceTool: ServiceTool, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<ToolDto[]> {
    return this.serviceTool.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ToolDto | null> {

    // puedo eliminar
    //puedo cambiar de categoria
    //deshabilitar la herramienta darle de baja
    return this.serviceTool.findOne(id);
  }

  @Post()
  async create(@Body() tool: CreateToolDto): Promise<ToolDto | null> {

    try {
      this.createTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceTool.create(this.createTool) .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  // este metodo es para actualizar la tool junto con su categoryId
  @Put('/up/:id')
  async update(@Param('id') toolId: string, @Body() tool): Promise<ToolDto | null> {

    //buscar por id, nombre, categoria
    try {
      this.updateTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceTool.update(Number(toolId), this.updateTool).then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}