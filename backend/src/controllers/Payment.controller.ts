import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, ParseIntPipe, NotFoundException, InternalServerErrorException, Put } from '@nestjs/common';
import { ServicePayment} from 'src/services/Payment.service';
import { EntityPayment } from 'src/entities/Payment.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Controller('payment')
export class  ControllerPayment {
  newPayment: EntityPayment;
  constructor(private readonly servicePayment: ServicePayment, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<EntityPayment[]> {
    return this.servicePayment.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityPayment|null> {
    return this.servicePayment.findOne(+id);
  }

  @Post()
    async create(@Body() payment: EntityPayment) {
      //return this.serviceClient.create(client);
  
      try {
        this.newPayment = payment;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while creating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      await this.servicePayment.create(this.newPayment)
        .then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }
  
   
    /*@Delete(':paymentId')
    async remove(@Param('paymentId', ParseIntPipe) paymentId: number) {
      try {
        const payment = await this.servicePayment.findOne(paymentId);
  
        if (!payment) {
          throw new NotFoundException(`Pago ${paymentId} no encontrado`);
        }
        await this.servicePayment.delete(paymentId); // También puedes usar `remove(entity)` si lo necesitas
        return `Pago ${paymentId} eliminado correctamente`;
  
      } catch (error) {
        console.error('Error al eliminar el pago:', error);
  
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error interno al eliminar el pago');
      }
    }*/
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() payment) {
  
      try {
        this.newPayment = payment;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while updating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      await this.servicePayment.update(id, this.newPayment)
        .then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }
}