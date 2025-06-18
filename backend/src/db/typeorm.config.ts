import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DbUtilService_Cls } from "./db-util.service";

export const typeOrmConfig: TypeOrmModuleAsyncOptions={
    inject: [DbUtilService_Cls],
    extraProviders: [DbUtilService_Cls],
    useFactory: (dbUtil: DbUtilService_Cls)=>{
        if(dbUtil.getPersistentceType()==="postgres"){
            return postgresFactory(dbUtil);
        }
        else{
            return postgresFactory(dbUtil);
        }
    }
}

function postgresFactory(dbUtil: DbUtilService_Cls): TypeOrmModuleOptions {
    let postgresConfig: TypeOrmModuleOptions = {
        type: 'postgres',
        host: dbUtil.getHost(),
        port: 5432,
        username: dbUtil.getUser(),
        password: dbUtil.getPass(),
        database: dbUtil.getDbName(),
        entities: dbUtil.getEntities(),
        synchronize: false,
        autoLoadEntities: false,
    }

    return postgresConfig;
}