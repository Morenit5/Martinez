import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "src/db/typeorm.config";

@Module({
    imports: [TypeOrmModule.forRootAsync(typeOrmConfig)]
})

export class DatabaseModule_Cls {
    
}
