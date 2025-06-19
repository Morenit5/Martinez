import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { ControllerServiceDetail } from 'src/controllers/ServiceDetail.controller';
import { EntityInvoiceDetails } from 'src/entities/InvoiceDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityInvoiceDetails])],
  providers: [ServiceDetailService],
  exports: [ServiceDetailService],
  controllers: [ControllerServiceDetail],
})
export class ServiceDetailModule {}