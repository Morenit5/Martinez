import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DbUtilService_Cls } from "./db-util.service";
import { DataSource } from "typeorm";

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    inject: [DbUtilService_Cls],
    extraProviders: [DbUtilService_Cls],
    useFactory: (dbUtil: DbUtilService_Cls) => {
        if (dbUtil.getPersistentceType() === "postgres") {
            return postgresFactory(dbUtil);
        }
        else {
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
        ssl: {
            rejectUnauthorized: false, // 🔴 obligatorio para Supabase
        },
        extra: {
            //  fuerza IPv4
            host: dbUtil.getHost()?.replace(/\[.*\]/, ''),
        },
        retryAttempts: 10,
        retryDelay: 3000, // 3 segundos
        connectTimeoutMS: 30000, // 30 segundos
        //logging: true,
        poolErrorHandler: async (err) => {
            const reconnection = setInterval(async () => {
                //console.log('Retrying connection...');
                const connection = new DataSource({
                    type: 'postgres',
                    host: dbUtil.getHost(),
                    port: 5432,
                    username: dbUtil.getUser(),
                    password: dbUtil.getPass(),
                    database: dbUtil.getDbName(),
                });
                const db = await connection.initialize();
                if (db.isInitialized) clearInterval(reconnection);
            }, 1000);
        },
    }

    return postgresConfig;
}
