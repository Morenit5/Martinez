import { Controller, Get, Post, Body, Param,  HttpException, HttpStatus,  Put, Query } from '@nestjs/common';
import { ServiceService} from '../services/Service.service';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { log } from 'console';

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

  @Get('/type')
  findAllBy(@Query('typeName') itemName: string,@Query('extra') isExtra?: string): Promise<ServiceDto[]> {
    //console.log('llegamos en el contorller  con valores ' + itemName + ' isExtra => ' + isExtra );
    let val:string;
    if(isExtra == undefined){val = 'false' } else { val = isExtra == 'true'? 'true': 'false' }
    console.log('legamos con ==> ' + val);
    return this.serviceService.findAllBy(itemName,val);
  }

  @Get('/closed')
  findAllClosedBy(@Query('name') name?: string,@Query('lastName') lastName?: string,@Query('date') date?: string): Promise<ServiceDto[]> {
    console.log('llegamos en el contorller  con valores Name ' + name + " Last " + lastName + ' date ' + date );
  
    
    return this.serviceService.findAllClosed(name,lastName,date);
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
        //console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}