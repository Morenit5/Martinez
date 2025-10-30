import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from 'src/services/Service.service';
import { ControllerService } from 'src/controllers/Service.controller';
import { EntityService } from 'src/entities/Service.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { EmailService } from 'src/services/Email.service';
import { EmailController } from 'src/controllers/Email.controller';
import { EntityConfiguration } from 'src/entities/Configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityService,EntityConfiguration])],
  providers: [ServiceService, TypeORMExceptions, EmailService],
  exports: [ServiceService, EmailService],
  controllers: [ControllerService, EmailController],
})
export class ServiceModule {}