import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule_Cls } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DbUtilService_Cls } from './db/db-util.service';
import { CategoryModule } from './modules/Category.module';
import { ClientModule } from './modules/Client.module';
import { InvoiceDetailModule } from './modules/InvoiceDetail.module';
import { ServiceDetailModule } from './modules/ServiceDetail.module';
import { ColumnNumericTransformer } from './utils/ColumnNumericTransformer';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import { provideHttpClient } from '@angular/common/http';

let importModules =[
  ConfigModule.forRoot({
    isGlobal :true,
  }),
  DatabaseModule_Cls,
  UsersModule,
  CategoryModule,
  ClientModule,
  InvoiceDetailModule,
  ServiceDetailModule
];

@Module({
  imports: [
    ...importModules
  ],
  controllers: [AppController],
  providers: [AppService, DbUtilService_Cls,ColumnNumericTransformer], /*Para que otras clases los puedan encontrar */
})

export class AppModule {
  constructor() {

  }
}


