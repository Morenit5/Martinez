import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, CreateUserLoginDto, UpdateUserDto, userDto } from '../dto/User.dto';
import { EntityUser } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Injectable()
export class ServiceUser {
    constructor(@InjectRepository(EntityUser) private userRepository: Repository<EntityUser>,private readonly exceptions:TypeORMExceptions ) {
    }

    async findAll(): Promise<userDto[]> {
        var users: userDto[] = await this.userRepository.find({ relations: { rol: true } }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return users;
    }

    async findOne(userId: number): Promise<userDto | null> {

        var user: userDto = await this.userRepository.findOne({
            where: { userId: userId },
            relations: { rol: true }

        }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return user;
        
    }

    //este endpoint es para crear usuario completo con user . clave, permisos etc
    createFullUser(user: CreateUserLoginDto): Promise<userDto> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    //este endpoint es para crear usuario detalles como el nombre apellidos etc
    createUser(user: CreateUserDto): Promise<userDto> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async delete(userId: number): Promise<void> {
        await this.userRepository.delete(userId);
    }

    async update(userId: number, entity: UpdateUserDto): Promise<userDto | null> {
        await this.userRepository.update(userId, entity);
        return this.userRepository.findOneBy({ userId });
    }
}