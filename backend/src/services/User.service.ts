import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityUser } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

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

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}