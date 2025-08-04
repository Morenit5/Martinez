import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CreateUserDto, CreateUserLoginDto, UpdateUserDto, userDto } from '../dto/User.dto';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { ServiceUser } from '../services/User.service';
import { Serializer } from 'src/interceptors/UserTransform.interceptor';

//@Controller('user')
@Serializer(userDto)
@Controller({ version: '1', path: 'user' })
export class ControllerUser {
  newUser: CreateUserLoginDto;
  updateUser: UpdateUserDto;

  constructor(private readonly serviceUser: ServiceUser, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<userDto[]> {
    return this.serviceUser.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<userDto | null> {
    return this.serviceUser.findOne(+id);
  }

  @Post()
  async create(@Body() user: CreateUserLoginDto): Promise<userDto> {

    try {
      this.newUser = user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceUser.createFullUser(this.newUser).then((result: any) => {
        return result;
    }).catch((error: any) => {
        this.exceptions.sendException(error);
    });

  }

  @Put('/up/:id')
  async update(@Param('id') toolId: string, @Body() user): Promise<userDto | null> {
  
      //buscar por id, nombre, categoria
      try {
        this.updateUser = user;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while updating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      return await this.serviceUser.update(Number(toolId), this.updateUser).then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }

  /*@Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceUser.delete(+id);
  }*/
}