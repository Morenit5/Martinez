import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CreateServiceDetailDto, ServiceDetailDto, UpdateServiceDetailDto } from 'src/dto/ServiceDetail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

//@Controller('servicedetail')
@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'servicedetail' })
export class ControllerServiceDetail {

  newServiceDetail: CreateServiceDetailDto;
  updateServiceDetail: UpdateServiceDetailDto;
  constructor(private readonly serviceDetailService: ServiceDetailService, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<ServiceDetailDto[]> {
    return this.serviceDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ServiceDetailDto | null> {
    return this.serviceDetailService.findOne(+id);
  }

  @Post()
  async create(@Body() serviceDetail: CreateServiceDetailDto): Promise<undefined> {
    
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
        //console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

  }

 /* @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceDetailService.delete(+id);
  }*/

  @Put('/up/:id')
    async update(@Param('id') serviceDetailId: number, @Body() serviceDetail) {
  
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
  
      await this.serviceDetailService.update(serviceDetailId, this.updateServiceDetail)
        .then((result: any) => {
          //console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }
}