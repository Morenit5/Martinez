import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityUser } from 'src/entities/User.entity';
//import { EntityUser } from 'src/entities/User.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ServiceUser {
    constructor(@InjectRepository(EntityUser) private userRepository: Repository<EntityUser>) {

    }

    findAll(): Promise<EntityUser[]> {
        return this.userRepository.find();
    }

    findOne(userId: number): Promise<EntityUser | null> {
        return this.userRepository.findOneBy({ userId });
    }

    create(user: EntityUser): Promise<EntityUser> {
        return this.userRepository.save(user);
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async update(id: string, entity: EntityUser): Promise<UpdateResult> {
        return await this.userRepository.update(id, entity);
    }
}