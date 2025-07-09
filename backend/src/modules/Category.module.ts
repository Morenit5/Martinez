import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from 'src/services/Category.service';
import { ControllerCategory } from 'src/controllers/Category.controller';
import { EntityCategory } from 'src/entities/Category.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceTool } from 'src/services/Tool.service';
import { EntityTool } from 'src/entities/Tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityCategory,EntityTool])],
  providers: [ServiceCategory,TypeORMExceptions, ServiceTool],
  exports: [ServiceCategory],
  controllers: [ControllerCategory],
})
export class CategoryModule {}