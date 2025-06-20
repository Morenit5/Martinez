import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { exit } from "node:process";



@Injectable()
export class DbUtilService_Cls {
    
    hostname?: string;
    username?: string;
    password?: string;
    databasename?: string;
    type: string;
    databaseEntities: any[];
    databaseMigrations: any[];
    migrationFolder:any;

    constructor(private readonly ConfigService: ConfigService) {
        this.hostname = process.env.DB_HOST; 
        this.username = process.env.DB_USER;
        this.password = process.env.DB_PASSWORD;
        this.databasename = process.env.DB_NAME;
        this.type = process.env.DB_TYPE || 'postgres';

        this.databaseEntities = ["src/entities/*.entity.js", "dist/entities/*.entity.js"];
        this.migrationFolder = "**/migrations/postgres";
        this.databaseMigrations = [this.migrationFolder + "/*.ts"]

        if(undefined == this.hostname || undefined == this.username || undefined == this.password || undefined == this.databasename){
            console.log('something is wrong with the database config');
            exit(1);
        }
    }

    getHost(){
        return this.hostname;
    }
     getUser(){
        return  this.username;
    }
     getPass(){
        return  this.password;
    }
     getDbName(){
        return this.databasename;
    }

    getPersistentceType(){
        return this.type;
    }

    getEntities() {
       return this.databaseEntities;
    }

    getMigrations(){
        return this.databaseMigrations;
    }

    getMigrationsDir(){
        return this.migrationFolder;
    }
}