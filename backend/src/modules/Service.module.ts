import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from 'src/services/Service.service';
import { ControllerService } from 'src/controllers/Service.controller';
import { EntityService } from 'src/entities/Service.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Module({
  imports: [TypeOrmModule.forFeature([EntityService])],
  providers: [ServiceService, TypeORMExceptions],
  exports: [ServiceService],
  controllers: [ControllerService],
})
export class ServiceModule {}