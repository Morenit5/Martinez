import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { EntityUser } from 'src/entities/User.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceUser } from 'src/services/User.service';

@Controller('user')
export class ControllerUser {
  newUser: EntityUser;
  constructor(private readonly serviceUser: ServiceUser, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<EntityUser[]> {
    return this.serviceUser.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EntityUser | null> {
    return this.serviceUser.findOne(+id);
  }

  @Post()
  async create(@Body() user: EntityUser): Promise<undefined> {

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

    await this.serviceUser.create(this.newUser)
      .then((result: any) => {
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