import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from 'src/services/Category.service';
import { ControllerCategory } from 'src/controllers/Category.controller';
import { EntityCategory } from 'src/entities/Category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityCategory])],
  providers: [ServiceCategory],
  exports: [ServiceCategory],
  controllers: [ControllerCategory],
})
export class CategoryModule {}