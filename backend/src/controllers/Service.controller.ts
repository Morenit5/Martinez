import { Controller, Get, Post, Body, Param,  HttpException, HttpStatus,  Put } from '@nestjs/common';
import { ServiceService} from '../services/Service.service';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';

//@Controller('service')
@Controller({ version: '1', path: 'service' })
export class  ControllerService {
  newService: CreateServiceDto;
  updateService: UpdateServiceDto;
  constructor(private readonly serviceService: ServiceService, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<ServiceDto[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ServiceDto|null> {
    return this.serviceService.findOne(+id);
  }

  @Post()
  async create(@Body() service: CreateServiceDto) {

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

  @Put('/up/:id')
  async update(@Param('id') id: string, @Body() service) {

    try {
      this.updateService = service;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceService.update(+id, this.updateService)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}