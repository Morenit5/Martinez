import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { EntityServiceDetail } from 'src/entities/ServiceDetails.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

//@Controller('servicedetail')
@Controller({ version: '1', path: 'servicedetail' })
export class ControllerServiceDetail {

  newServiceDetail: EntityServiceDetail;
  constructor(private readonly serviceDetailService: ServiceDetailService, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<EntityServiceDetail[]> {
    return this.serviceDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityServiceDetail | null> {
    return this.serviceDetailService.findOne(+id);
  }

  @Post()
  async create(@Body() serviceDetail: EntityServiceDetail): Promise<undefined> {
    
    try {
      this.newServiceDetail = serviceDetail;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceDetailService.create(this.newServiceDetail)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

  }

 /* @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceDetailService.delete(+id);
  }*/

  @Put(':id')
    async update(@Param('id') serviceDetailId: string, @Body() serviceDetail) {
  
      try {
        this.newServiceDetail = serviceDetail;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while updating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      await this.serviceDetailService.update(serviceDetailId, this.newServiceDetail)
        .then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }
}