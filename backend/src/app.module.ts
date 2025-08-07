import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule_Cls } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DbUtilService_Cls } from './db/db-util.service';
import { CategoryModule } from './modules/Category.module';
import { ClientModule } from './modules/Client.module';
import { InvoiceDetailModule } from './modules/InvoiceDetail.module';
import { ServiceDetailModule } from './modules/ServiceDetail.module';
import { ColumnNumericTransformer } from './utils/ColumnNumericTransformer';
import { InvoiceModule } from './modules/Invoice.module';
import { PaymentModule } from './modules/Payment.module';
import { ServiceModule } from './modules/Service.module';
import { ToolModule } from './modules/Tool.module';
import { TypeORMExceptions } from './exceptions/TypeORMExceptions';
import { UserModule } from './modules/User.module';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import { provideHttpClient } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './modules/Permission.module';
import { RolModule } from './modules/Rol.module';

let importModules =[
  ConfigModule.forRoot({
    isGlobal :true,
  }),
  DatabaseModule_Cls,
  /*UsersModule,*/
  CategoryModule,
  ClientModule,
  InvoiceDetailModule,
  ServiceDetailModule, 
  InvoiceModule,
  PaymentModule,
  ServiceModule,
  ToolModule,
  UserModule,
  PermissionModule,
  RolModule
];

@Module({
  imports: [
    ...importModules,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, DbUtilService_Cls,ColumnNumericTransformer,TypeORMExceptions], /*Para que otras clases los puedan encontrar */
})

export class AppModule {
  constructor() {

  }
}


