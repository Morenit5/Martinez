import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLoginDto, userDto } from 'src/dto/User.dto';
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

  findAll(){//}: Promise<userDto[]> {
    //return this.usersRepository.find();
  }

  findOne(uname:string){//: Promise<EntityUser|null> {
    //return this.usersRepository.findOneBy({ username:uname });
  }

  findOneBy(userid?:number,uname?:string){//: Promise<EntityUser|null> {
    //return this.usersRepository.findOneBy({ userId:userid, username:uname });
  }

  /*async findOne(username: string | undefined): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }*/

  create(user: CreateUserLoginDto){//: Promise<userDto> {
    //return this.usersRepository.save(user);
  }

  async remove(id: number){//: Promise<void> {
    //await this.usersRepository.delete(id);
  }

  update(user: CreateUserLoginDto){//: Promise<userDto> {
    //return this.usersRepository.save(user);
  }
}