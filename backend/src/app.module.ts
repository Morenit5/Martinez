import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule_Cls } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DbUtilService_Cls } from './db/db-util.service';
import { provideHttpClient } from '@angular/common/http';

let importModules =[
  ConfigModule.forRoot({
    isGlobal :true,
  }),
  DatabaseModule_Cls,
  UsersModule
];

@Module({
  imports: [
    ...importModules
  ],
  controllers: [AppController],
  providers: [AppService, DbUtilService_Cls], /*Para que otras clases los puedan encontrar */
})

export class AppModule {
  constructor() {

  }
}


