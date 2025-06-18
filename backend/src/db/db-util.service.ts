import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class DbUtilService_Cls {
    
    hostname: string;
    username: string;
    password: string;
    databasename: string
    type : string;
    databaseEntities: any[];
    databaseMigrations: any[];
    migrationFolder:any;

    constructor(private readonly ConfigService: ConfigService) {
        this.hostname = 'localhost';
        this.username = 'postgres';
        this.password = 'root';
        this.databasename = 'postgres';
        this.type = 'postgres';

        this.databaseEntities = ["src/entities/*.entity.js", "dist/entities/*.entity.js"];
        this.migrationFolder = "**/migrations/postgres";
        this.databaseMigrations = [this.migrationFolder + "/*.ts"]
    }

    getHost():string{
        return this.hostname;
    }
     getUser():string{
        return  this.username;
    }
     getPass():string{
        return  this.password;
    }
     getDbName():string{
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