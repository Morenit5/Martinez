import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceInvoice } from 'src/services/Invoice.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto } from 'src/dto/Invoice.dto';

//@Controller('invoice')
@Controller({ version: '1', path: 'inv' })
export class  ControllerInvoice {
  newInvoice: CreateInvoiceDto;
  updateInvoice: UpdateInvoiceDto;
  constructor(private readonly serviceInvoice: ServiceInvoice, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<InvoiceDto[]> {
    return this.serviceInvoice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InvoiceDto|null> {
    return this.serviceInvoice.findOne(+id);
  }

  @Post()
  async create(@Body() invoice: CreateInvoiceDto) {
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

   @Put('/up/:id')
     async update(@Param('id') id: number, @Body() invoice) {
   
       try {
         this.updateInvoice = invoice;
       } catch (error) {
         throw new HttpException({
           status: HttpStatus.INTERNAL_SERVER_ERROR,
           error: "Internal error while updating"
         },
           HttpStatus.INTERNAL_SERVER_ERROR, {
           cause: error
         });
       }
   
       await this.serviceInvoice.update(id, this.updateInvoice)
         .then((result: any) => {
           console.log("Result:", result);
           return result;
         }).catch((error: any) => {
           this.exceptions.sendException(error);
         });
     }
}