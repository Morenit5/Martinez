import { DbUtilService_Cls } from "./db-util.service";
import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const getDefaultOptions =(dbUtil: DbUtilService_Cls)=>{
    if(dbUtil.getPersistentceType()==="postgres"){
            return postgresFactory(dbUtil);
        }
        else{
            return postgresFactory(dbUtil);
        }
}

function postgresFactory(dbUtil: DbUtilService_Cls) {
    let postgresConfig = {
        type: 'postgres',
        host: dbUtil.getHost(),
        port: 5432,
        username: dbUtil.getUser(),
        password: dbUtil.getPass(),
        database: dbUtil.getDbName(),
        entities: dbUtil.getEntities(),
        migrations: dbUtil.getMigrations(),
        //logging: true,
        cli: {
            migrationsDir: dbUtil.getMigrationsDir()
        },
        synchronize: false,
        autoLoadEntities: true, //false,
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


var dbUtils = new DbUtilService_Cls(new ConfigService());
//console.log(getDefaultOptions(dbUtils));
//console.log('prueba')

const opts = getDefaultOptions(dbUtils);
export const AppDataSource = new DataSource({
    ... opts as DataSourceOptions,
});
