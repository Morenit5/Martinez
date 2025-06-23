import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceInvoice } from 'src/services/Invoice.service';
import { ControllerInvoice } from 'src/controllers/Invoice.controller';
import { EntityInvoice } from 'src/entities/Invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityInvoice])],
  providers: [ServiceInvoice],
  exports: [ServiceInvoice],
  controllers: [ControllerInvoice],
})
export class InvoiceModule {}