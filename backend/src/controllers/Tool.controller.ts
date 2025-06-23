import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceTool } from 'src/services/Tool.service';
import { EntityTool} from 'src/entities/Tool.entity';

@Controller('tool')
export class  ControllerTool {
  constructor(private readonly serviceTool: ServiceTool) {}

  @Get()
  findAll(): Promise<EntityTool[]> {
    return this.serviceTool.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityTool|null> {
    return this.serviceTool.findOne(+id);
  }

  @Post()
  create(@Body() tool: EntityTool): Promise<EntityTool> {
    return this.serviceTool.create(tool);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceTool.remove(+id);
  }
}