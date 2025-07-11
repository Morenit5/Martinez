import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
require('dotenv').config();

async function bootstrap() {

 generateDB();
 
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT ?? 3001);
  process.on('unhandledRejection', (e) => {
    console.log(e);
   });
  console.log('La aplicación ya esta corriendo http://localhost:3001/');
}

function generateDB() {

  try{
    execSync("npm run migration-gen:postgres"); //,{stdio:'inherit'});
  } catch (error: any) {
    console.log(error);
  }
  
  try {
    execSync("npm run migration-run"); //,{stdio:'inherit'});
  } catch (error: any) {
    console.log(error);
  }
}

bootstrap(); //init application

