import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { ConfigurationService } from 'src/services/Configuration.service';
import { ConfigurationController } from 'src/controllers/Configuration.controller';
import { EmailService } from 'src/services/Email.service';
import { EntityService } from 'src/entities/Service.entity';
import { ServiceService } from 'src/services/Service.service';
import { EntityInvoice } from 'src/entities/Invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityConfiguration,EntityService, EntityInvoice])],
  providers: [ConfigurationService, EmailService,ServiceService, TypeORMExceptions],
  exports: [ConfigurationService,EmailService],
  controllers: [ConfigurationController],
})
export class ConfigurationModule {}