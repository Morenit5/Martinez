import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceClient } from 'src/services/Client.service';
import { ClientController } from 'src/controllers/Client.controller';
import { EntityClient } from 'src/entities/Client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityClient])],
  providers: [ServiceClient],
  exports: [ServiceClient],
  controllers: [ClientController],
})
export class ClientModule {}