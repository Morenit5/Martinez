import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerUser } from 'src/controllers/User.controller';
import { EntityUser } from 'src/entities/User.entity';
import { ServiceUser } from 'src/services/User.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntityUser])],
  providers: [ServiceUser],
  exports: [ServiceUser],
  controllers: [ControllerUser],
})
export class UserModule {}