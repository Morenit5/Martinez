/*import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityUser } from 'src/entities/User.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(EntityUser) private usersRepository: Repository<EntityUser>) {
    
  }

  findAll(): Promise<EntityUser[]> {
    return this.usersRepository.find();
  }

  findOne(userId: number): Promise<EntityUser|null> {
    return this.usersRepository.findOneBy({ userId });
  }

  create(user: EntityUser): Promise<EntityUser> {
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}*/