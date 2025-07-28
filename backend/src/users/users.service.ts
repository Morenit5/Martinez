import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityUser } from 'src/entities/User.entity';
import { Repository } from 'typeorm';


export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'juanito',
      password: 'caminante',
    }
  ];
  constructor(@InjectRepository(EntityUser) private usersRepository: Repository<EntityUser>) {
    
  }

  findAll(): Promise<EntityUser[]> {
    return this.usersRepository.find();
  }

  /*findOne(userId: number): Promise<EntityUser|null> {
    return this.usersRepository.findOneBy({ userId });
  }*/

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  create(user: EntityUser): Promise<EntityUser> {
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}