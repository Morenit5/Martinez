import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, NotFoundException, InternalServerErrorException, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceInvoice } from 'src/services/Invoice.service';
import { EntityInvoice } from 'src/entities/Invoice.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

//@Controller('invoice')
@Controller({ version: '1', path: 'invoice' })
export class  ControllerInvoice {
  newInvoice: EntityInvoice;
  constructor(private readonly serviceInvoice: ServiceInvoice, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<EntityInvoice[]> {
    return this.serviceInvoice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityInvoice|null> {
    return this.serviceInvoice.findOne(+id);
  }

  @Post()
  async create(@Body() invoice: EntityInvoice) {
      //return this.serviceClient.create(client);
  
      try {
        this.newInvoice = invoice;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while creating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      await this.serviceInvoice.create(this.newInvoice)
        .then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }


 /*@Delete(':invoiceId')
   async remove(@Param('invoiceId',ParseIntPipe) invoiceId: number)
   {
      try
      {
       const invoice = await this.serviceInvoice.findOne(invoiceId);
 
       if (!invoice) {
         throw new NotFoundException(`Factura ${invoiceId} no encontrada`);
       }
       await this.serviceInvoice.delete(invoiceId); // También puedes usar `remove(entity)` si lo necesitas
       return `Factura ${invoiceId} eliminada correctamente`;
 
     } catch (error){
       console.error('Error al eliminar la Factura:', error);
 
       if (error instanceof NotFoundException) {
         throw error;
       }
       throw new InternalServerErrorException('Error interno al eliminar la Factura');
     }
   }*/

   @Put(':id')
     async update(@Param('id') id: string, @Body() invoice) {
   
       try {
         this.newInvoice = invoice;
       } catch (error) {
         throw new HttpException({
           status: HttpStatus.INTERNAL_SERVER_ERROR,
           error: "Internal error while updating"
         },
           HttpStatus.INTERNAL_SERVER_ERROR, {
           cause: error
         });
       }
   
       await this.serviceInvoice.update(id, this.newInvoice)
         .then((result: any) => {
           console.log("Result:", result);
           return result;
         }).catch((error: any) => {
           this.exceptions.sendException(error);
         });
     }
}