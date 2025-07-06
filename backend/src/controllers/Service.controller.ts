import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, ParseIntPipe, Put } from '@nestjs/common';
import { ServiceService} from 'src/services/Service.service';
import { EntityService } from 'src/entities/Service.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Controller('service')
export class  ControllerService {
  newService: EntityService;
  constructor(private readonly serviceService: ServiceService, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<EntityService[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityService|null> {
    return this.serviceService.findOne(+id);
  }

  @Post()
  async create(@Body() service: EntityService) {
    //return this.serviceClient.create(client);

    try {
      this.newService = service;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceService.create(this.newService)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

 /* @Delete(':serviceId')
  async remove(@Param('serviceId', ParseIntPipe) serviceId: number){
    try {
      const payment = await this.serviceService.findOne(serviceId);

      if (!payment) {
        throw new NotFoundException(`Servicio ${serviceId} no encontrado`);
      }
      await this.serviceService.delete(serviceId); // También puedes usar `remove(entity)` si lo necesitas
      return `Servicio ${serviceId} eliminado correctamente`;

    } catch (error) {
      console.error('Error al eliminar el Servicio:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al eliminar el Servicio');
    }
  }*/

  @Put(':id')
  async update(@Param('id') id: string, @Body() service) {

    try {
      this.newService = service;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceService.update(id, this.newService)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}