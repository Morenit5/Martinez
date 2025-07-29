import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTool } from 'src/services/Tool.service';
import { ControllerTool } from 'src/controllers/Tool.controller';
import { EntityTool } from 'src/entities/Tool.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceCategory } from 'src/services/Category.service';
import { EntityCategory } from 'src/entities/Category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTool,EntityCategory])],
  providers: [ServiceTool, TypeORMExceptions, ServiceCategory],
  exports: [ServiceTool],
  controllers: [ControllerTool],
})
export class ToolModule {}