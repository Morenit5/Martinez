import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTool } from 'src/services/Tool.service';
import { ControllerTool } from 'src/controllers/Tool.controller';
import { EntityTool } from 'src/entities/Tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTool])],
  providers: [ServiceTool],
  exports: [ServiceTool],
  controllers: [ControllerTool],
})
export class ToolModule {}