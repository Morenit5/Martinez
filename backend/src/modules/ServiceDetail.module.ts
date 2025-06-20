import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { ControllerServiceDetail } from 'src/controllers/ServiceDetail.controller';
//import { EntityInvoiceDetails } from 'src/entities/InvoiceDetails.entity';
import { EntityServiceDetail } from 'src/entities/ServiceDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityServiceDetail])],
  providers: [ServiceDetailService],
  exports: [ServiceDetailService],
  controllers: [ControllerServiceDetail],
})
export class ServiceDetailModule {}