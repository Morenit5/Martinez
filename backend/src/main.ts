import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import { VersioningType } from '@nestjs/common';
require('dotenv').config();

async function bootstrap() {

 generateDB();
 
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning
    defaultVersion: '1', // Optional: Set a default version
  });

  await app.listen(process.env.PORT ?? 3001);
  process.on('unhandledRejection', (e) => {
    console.log(e);
   });
  console.log('La aplicación ya esta corriendo http://localhost:3001/');
}

function generateDB() {

  try{
    const resp = execSync("npm run migration-gen:postgres"); //,{stdio:'inherit'});
    resp.toString('utf8');
    console.log('resp1 :' + resp); 
  } catch (error: any) {
    console.log(error.toString('utf8'));
  }
  
  try {
    const resp = execSync("npm run migration-run"); //,{stdio:'inherit'});
    console.log('resp2 :' + resp); 
  } catch (error: any) {
    console.log(error.toString('utf8'));
  }
}

bootstrap(); //init application

