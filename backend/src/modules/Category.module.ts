import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from 'src/services/Category.service';
import { ControllerCategory } from 'src/controllers/Category.controller';
import { EntityCategory } from 'src/entities/Category.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Module({
  imports: [TypeOrmModule.forFeature([EntityCategory])],
  providers: [ServiceCategory,TypeORMExceptions],
  exports: [ServiceCategory],
  controllers: [ControllerCategory],
})
export class CategoryModule {}