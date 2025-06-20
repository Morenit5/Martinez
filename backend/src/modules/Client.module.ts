import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceClient } from 'src/services/Client.service';
import { ControllerClient } from 'src/controllers/Client.controller';
import { EntityClient } from 'src/entities/Client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityClient])],
  providers: [ServiceClient],
  exports: [ServiceClient],
  controllers: [ControllerClient],
})
export class ClientModule {}