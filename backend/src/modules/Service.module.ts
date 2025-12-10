import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from 'src/services/Service.service';
import { ControllerService } from 'src/controllers/Service.controller';
import { EntityService } from 'src/entities/Service.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
//import { EmailService } from 'src/services/Email.service';
//import { EmailController } from 'src/controllers/Email.controller';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { EntityInvoice } from 'src/entities/Invoice.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EntityService,EntityConfiguration, EntityInvoice]), ConfigModule],
  providers: [ServiceService, TypeORMExceptions/*, EmailService*/],
  exports: [ServiceService/*, EmailService*/],
  controllers: [ControllerService/*, EmailController*/],
})
export class ServiceModule {}