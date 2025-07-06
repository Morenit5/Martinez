import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailService } from 'src/services/ServiceDetail.service';
import { ControllerServiceDetail } from 'src/controllers/ServiceDetail.controller';
import { EntityServiceDetail } from 'src/entities/ServiceDetails.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Module({
  imports: [TypeOrmModule.forFeature([EntityServiceDetail])],
  providers: [ServiceDetailService, TypeORMExceptions],
  exports: [ServiceDetailService],
  controllers: [ControllerServiceDetail],
})
export class ServiceDetailModule {}