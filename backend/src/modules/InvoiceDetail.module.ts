import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceInvoiceDetail } from 'src/services/InvoiceDetails.service';
import { ControllerInvoiceDetail } from 'src/controllers/InvoiceDetail.controller';
import { EntityInvoiceDetails } from 'src/entities/InvoiceDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityInvoiceDetails])],
  providers: [ServiceInvoiceDetail],
  exports: [ServiceInvoiceDetail],
  controllers: [ControllerInvoiceDetail],
})
export class InvoiceDetailModule {}