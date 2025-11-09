import { ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EntityService } from 'src/entities/Service.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ConfigurationService {

    constructor(@InjectRepository(EntityConfiguration) private configRepository: Repository<EntityConfiguration>, private readonly exceptions: TypeORMExceptions) {
    }

    async create(configuration: EntityConfiguration): Promise<EntityConfiguration | null> {

        try {
            const newConfiguration = this.configRepository.create(configuration);
            return await this.configRepository.save(newConfiguration);
        } catch (e: any) {
            // Postgres
            if (e.code === '23505'){
                throw new ConflictException('El correo ya está registrado.');
            } else {
                
                this.exceptions.sendException(e)
            }
            throw e;
        }
    }

    findAll(): Promise<EntityConfiguration[]> {
        return this.configRepository.find();
    }
}