import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityClient } from '../entities/Client.entity';
import { ClientDto, CreateClientDto, UpdateClientDto } from 'src/dto/Client.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Injectable()
export class ServiceClient {
  constructor(@InjectRepository(EntityClient) private clientRepository: Repository<EntityClient>,private readonly exceptions:TypeORMExceptions) {
  }

  findAll(): Promise<ClientDto[]> {
    return this.clientRepository.find({
      where: [
        { enabled: true },
      ],
    })
  }

  findAllBy(cltType: string): Promise<ClientDto[]> {
    return this.clientRepository.find({
      where: [{ 
        enabled: true,
        clientType: cltType
      }],
    })
  }


  findOne(clientId: number): Promise<ClientDto|null> {
    return this.clientRepository.findOneBy({ clientId });
  }

  findAllWithServices(): Promise<ClientDto[]> {
   //console.log('se ejecuto 1')
    var users=  this.clientRepository.find({ 
      relations: {
        service: true,
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return users;
  }


  findOneWithServices(clientId: number): Promise<ClientDto|null> {
     //console.log('se ejecuto 2')
     var user =  this.clientRepository.find({ 
      where: { clientId: clientId },
      relations: {
        service: true,
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return user;
  }

  async create(client:Partial<CreateClientDto>): Promise<ClientDto | null> {

    // verificamos que la categoria no se encuentre duplicada
    const existingClient = await this.clientRepository.findOne({ where: { email: client.email, phone: client.phone, enabled: false } });

    if(JSON.stringify(existingClient).length >0 )
    {
      client.clientId =existingClient?.clientId;
      client.enabled =true;
    }
      // 2) Intentar guardar y capturar error único de BD
      try {
        const newClient = this.clientRepository.create(client);
        return await this.clientRepository.save(newClient);
      } catch (e: any) {
        // Postgres
        if (e.code === '23505') throw new ConflictException('El cliente ya está registrado.');
        throw e;
      }
    }

  async delete(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async update(clientId: number, entity: UpdateClientDto): Promise<ClientDto | null> {
    await this.clientRepository.update(clientId, entity);
    return this.clientRepository.findOneBy({ clientId });
  }
}