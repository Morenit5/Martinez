import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put} from '@nestjs/common';
import { ServiceClient } from 'src/services/Client.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ClientDto, CreateClientDto, UpdateClientDto } from 'src/dto/Client.dto';

//@Controller('client')
@Controller({ version: '1', path: 'client' })
export class  ControllerClient {
  newClient: CreateClientDto;
  updateClient: UpdateClientDto;
  constructor(private readonly serviceClient: ServiceClient, private readonly exceptions: TypeORMExceptions) {}

  @Get()
  findAll(): Promise<ClientDto[]> {
    return this.serviceClient.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ClientDto|null> {
    return this.serviceClient.findOne(id);
  }

  @Get('/serv/a')
  findWithServices(): Promise<ClientDto[]> {
    return  this.serviceClient.findAllWithServices();
  }

  @Get('/serv/:id')
  findOneWithServices(@Param('id') id: number): Promise<ClientDto|null> {
    return this.serviceClient.findOneWithServices(id);
  }

  @Post()
  async create(@Body() client: CreateClientDto) {
    //return this.serviceClient.create(client);

    try {
      this.newClient = client;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceClient.create(this.newClient)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  /*@Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceClient.remove(+id);
  }*/

  /*@Delete(':clientId')
  async remove(@Param('clientId', ParseIntPipe) clientId: number) {
    try {
      const client = await this.serviceClient.findOne(clientId);

      if (!client) {
        throw new NotFoundException(`Cliente ${clientId} no encontrado`);
      }
      await this.serviceClient.delete(clientId); // También puedes usar `remove(entity)` si lo necesitas
      return `Cliente ${clientId} eliminado correctamente`;

    } catch (error) {
      console.error('Error al eliminar al cliente:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al eliminar al Cliente');
    }
  }*/

  @Put('/up/:id')
  async update(@Param('id') id: number, @Body() client) {

    try {
      this.updateClient = client;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    await this.serviceClient.update(id, this.updateClient)
      .then((result: any) => {
        console.log("Result:", result);
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}