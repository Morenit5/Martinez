import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTool } from 'src/services/Tool.service';
import { ControllerTool } from 'src/controllers/Tool.controller';
import { EntityTool } from 'src/entities/Tool.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTool])],
  providers: [ServiceTool, TypeORMExceptions],
  exports: [ServiceTool],
  controllers: [ControllerTool],
})
export class ToolModule {}