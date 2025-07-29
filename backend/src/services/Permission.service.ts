import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityPermission } from '../entities/Permission.entity';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { PermissionDto } from '../dto/Permission.dto';

@Injectable()
export class ServicePermission {
    constructor(@InjectRepository(EntityPermission) private permissionRepository: Repository<EntityPermission>,
                private readonly exceptions:TypeORMExceptions ) {
    }

    async findAll(): Promise<PermissionDto[]> {
        var permissions: PermissionDto[] = await this.permissionRepository.find({ relations: { rol: true } }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return permissions;
    }

    async findOne(rolId: number): Promise<PermissionDto | null> {

        var permissions: PermissionDto = await this.permissionRepository.find({
            where: { rol : { rolId : rolId } },
            relations: { rol: true }

        }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return permissions;
        
    }

    
}