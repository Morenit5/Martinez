import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class ServiceService {

  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>, private readonly exceptions: TypeORMExceptions) { }


  async findAll(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({ 
     relations: {
        client: true,
        serviceDetail:true,
        invoice: {
          payment:true,
        }
      },
       where: [{ 
        enabled: true,
        status: Not('Cerrado'),
      } ],
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }

  async findAllClosed(first?: string, last?: string, month?: string): Promise<ServiceDto[]> {
    var services: ServiceDto[];
    const currentYear  = new Date().getFullYear();
    let months: string[] = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] 
    

    if (!first && !last && !month) {
      services = await this.serviceRepository.find({
        relations: {
          client: true,
          serviceDetail: true,
          invoice: {
            payment:true
          }
        },
        where: [{
          enabled: true,
          status: 'Cerrado',
        }],
      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

    } else {

      let whereClause: { enabled: boolean, client?: { name?: string, lastName?:string }, invoice?: { invoiceDate?:any, }}[] = [];
      if(first && !last && !month) { 
        whereClause.push({
          enabled: true,
          client: {
            name: 'Fijo',
          }
        })
      } else if(last && !first && !month){
        whereClause.push({
          enabled: true,
          client: {
            lastName:''
          },
        })
      }
      else if(first && last && !month){
        whereClause.push({
          enabled: true,
          client: {
            name: 'Fijo',
            lastName:''
          }
        })
      }
      else if(month && !first && !last){
        const startDate = new Date(currentYear.toString() + '-' + months.indexOf(month)+1 + '-01');
        const endDate = new Date(currentYear.toString() + '-' + months.indexOf(month)+1 + '-31');
        whereClause.push({
          enabled: true,
          invoice: {
            invoiceDate:  Between(startDate, endDate),
          }
        })
        
      }

      services = await this.serviceRepository.find({
        relations: {
          client: true,
          serviceDetail: true,
          invoice: {
            payment: true,
          }
        },
        where: whereClause,
      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
    }

    return services;

  }

  //buscamos todos los servicios para el tipo de cliente solicitado ==> eventual. fijo
  async findAllBy(clntType: string, extra: string ): Promise<ServiceDto[]> {
    var services: ServiceDto[];
    if (extra == 'true') {
      console.log('en el if con tipo ' + clntType + ' y extra es ' + extra)
      services = await this.serviceRepository.find({
        relations: {
          client: true,
          serviceDetail: true,
          invoice: {
            payment: true,
          }
        },
        where: [{
          enabled: true,
          isExtra: true,
          status: Not('Cerrado'),
          client: {
            clientType: 'Fijo'
          }
        },

        ],

      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

    } else {
      console.log('en el else with ' + clntType)
      services = await this.serviceRepository.find({
        relations: {
          client: true,
          serviceDetail: true,
          invoice: {
            payment: true,
          }
        },
        where: [{
          enabled: true,
          isExtra: false,
          status: Not('Cerrado'),
          client: {
            clientType: clntType
          }
        },

        ],

      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
    }


    return services;
  }

  async findOne(serviceId: number): Promise<ServiceDto | null> {

    var service: ServiceDto = await this.serviceRepository.find({
      where: { serviceId: serviceId },
      relations: {
        client: true,
        serviceDetail: true,
        invoice: {
          payment: true,
          
        }
      }
    }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return service;

  }

  create(service: CreateServiceDto): Promise<ServiceDto> {
    return this.serviceRepository.save(service);
  }


  async update(serviceId: number, entity: UpdateServiceDto): Promise<ServiceDto | null> {
    await this.serviceRepository.save(entity);
    return this.serviceRepository.findOneBy({ serviceId })
    
  }


    async findAllEnabled(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({ 
       where: [{ 
        enabled: true
      } ],
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }
}