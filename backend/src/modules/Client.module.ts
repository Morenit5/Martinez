import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceClient } from 'src/services/Client.service';
import { ControllerClient } from 'src/controllers/Client.controller';
import { EntityClient } from 'src/entities/Client.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Module({
  imports: [TypeOrmModule.forFeature([EntityClient])],
  providers: [ServiceClient, TypeORMExceptions],
  exports: [ServiceClient],
  controllers: [ControllerClient],
})
export class ClientModule {}