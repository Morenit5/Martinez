import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, CreateUserLoginDto, UpdateUserDto, userDto } from '../dto/User.dto';
import { EntityUser } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ServiceUser {
    constructor(@InjectRepository(EntityUser) private userRepository: Repository<EntityUser>,private readonly exceptions:TypeORMExceptions ) {
    }

    async findAll(): Promise<userDto[]> {
        var users: userDto[] = await this.userRepository.find({ 
            where: [{ enabled: true } ],
            relations: { rol: true } }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return users;
    }

    async findOne(uname:string): Promise<userDto | null> {

        var user: userDto = await this.userRepository.findOne({
            where: { username: uname },
            relations: { rol: true }

        }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return user;
        
    }

    async findOneBy(userId: number,uname?:string): Promise<userDto | null> {

        var user: userDto = await this.userRepository.findOne({
            where: { userId: userId,  username:uname },
            relations: { rol: true }

        }).then((result: any) => {
            return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
        return user;
        
    }

    async isEmpty(): Promise<boolean> {

        const result = await this.userRepository.query(
            `SELECT 1 FROM entity_user LIMIT 1`
        );
    
        return result.length === 0;
    }

    //este endpoint es para crear usuario completo con user . clave, permisos etc
    async createFullUser(user: CreateUserLoginDto): Promise<userDto | any> {

        //console.log(JSON.stringify(user));
        // verificamos que el usuario no se encuentre duplicado
        const existingUser = await this.userRepository.findOne({ where: { email: user.email, enabled: false } });

        if (existingUser && JSON.stringify(existingUser).length > 0) {
            user.userId = existingUser?.userId;
            user.enabled = true; // lo habilitamos  
        }

        const hash = await this.hashData(user.password);

        try {
        const newUser = this.userRepository.create({ ...user, password: hash });
        return this.userRepository.save(newUser);
        } catch (e: any) {
              // Postgres
              if (e.code === '23505'){
                console.log('if e:'+e);
                throw new BadRequestException/*ConflictException*/('Error: El usuario ya está registrado');
                //throw e;
                //return { error: 'Error: La categoría ya está registrada.'}
              }
              else{
                console.log('else e:'+e);
                throw new BadRequestException(e);
                //return e;
              } 
              
            }
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

    async logoutUser(userId: number, entity: CreateUserLoginDto): Promise<userDto | null> {
        await this.userRepository.update(userId, entity);
        return this.userRepository.findOneBy({ userId });
    }

     async hashData(data: string) {
        return await bcrypt.hash(data, 10);
      }
}