import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, NotFoundException, InternalServerErrorException, Put, ParseIntPipe } from '@nestjs/common';
import { ServiceInvoiceDetail } from 'src/services/InvoiceDetails.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CreateInvoiceDetailsDto, InvoiceDetailsDto, UpdateInvoiceDetailsDto } from 'src/dto/InvoiceDetails.dto';

//@Controller('invoicedetail')
@Controller({ version: '1', path: 'invdetail' })
export class ControllerInvoiceDetail {
  newInvoiceDetail: CreateInvoiceDetailsDto;
  updateInvoiceDetail: UpdateInvoiceDetailsDto;
  constructor(private readonly serviceDetailService: ServiceInvoiceDetail, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<InvoiceDetailsDto[]> {
    return this.serviceDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<InvoiceDetailsDto|null> {
    return this.serviceDetailService.findOne(id);
  }

  @Post()
  async create(@Body() invoiceDetails: CreateInvoiceDetailsDto) {
    //return this.serviceClient.create(client);

    try {
      this.newInvoiceDetail = invoiceDetails;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceDetailService.create(this.newInvoiceDetail)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  /*@Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceInvoice.remove(+id);
  }*/
  /*@Delete(':invoiceDetailId')
  async remove(@Param('invoiceDetailId', ParseIntPipe) invoiceDetailId: number) {
    try {
      const invoiceDetail = await this.serviceDetailService.findOne(invoiceDetailId);

      if (!invoiceDetail) {
        throw new NotFoundException(`Detalle ${invoiceDetailId} no encontrado`);
      }
      await this.serviceDetailService.delete(invoiceDetailId); // También puedes usar `remove(entity)` si lo necesitas
      return `Detalle ${invoiceDetailId} eliminado correctamente`;

    } catch (error) {
      console.error('Error al eliminar el Detalle:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al eliminar');
    }
  }*/

  @Put('/up/:id')
  async update(@Param('id') id: number, @Body() invoiceDetail) {

    try {
      this.updateInvoiceDetail = invoiceDetail;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceDetailService.update(id, this.updateInvoiceDetail)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}