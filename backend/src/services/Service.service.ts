import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, FindOperator, ILike, In, Not, Or, Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';


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
        invoice: {
           invoiceStatus: Not('Cerrado'),
        }
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
          status: Or(Equal('Cerrado'),Equal('Recurrente')),
          invoice: {
            isGenerated:true,
            payment: {
              paymentStatus:'Pagado',
              paymentMethod: Not('Cash'),
            }
          }
        }],
      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

    } else {

      let whereClause: { enabled: boolean, client?: { name?: string| FindOperator<string>, lastName?:string | FindOperator<string> }, invoice?: { invoiceDate?:any, payment?:{ paymentMethod?:any } }}[] = [];
      if(first && !last && !month) { 
        whereClause.push({
          enabled: true,
          client: {
            name: ILike(`%${first}%`),
          },
          invoice: {
            payment: {
              paymentMethod: Not('Cash')
            }
          }
         
        })
      } else if(last && !first && !month){
        whereClause.push({
          enabled: true,
          client: {
            lastName:ILike(`%${last}%`),
          },
          invoice: {
            payment: {
              paymentMethod: Not('Cash')
            }
          }
        })
      }
      else if(first && last && !month){
        whereClause.push({
          enabled: true,
          client: {
            name: ILike(`%${first}%`),
            lastName: ILike(`%${last}%`)
          },
          invoice: {
            payment: {
              paymentMethod: Not('Cash')
            }
          }
          
        })
      }
      else if(month && !first && !last){
        let currentMonth = months.indexOf(month)+1;
        const startDate = new Date(currentYear.toString() + '-' + currentMonth + '-01');
        const endDate = new Date(currentYear.toString() + '-' + currentMonth + '-31');
        whereClause.push({
          enabled: true,
          invoice: {
            invoiceDate:  Between(startDate, endDate),
            payment: {
              paymentMethod: Not('Cash')
            }
          }
        })
        
      }

      services = await this.serviceRepository.find({
        relations: {
          client: true,
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


   async findAllCashClosed(month?: string): Promise<ServiceDto[]> {
    var services: ServiceDto[];
    const currentYear  = new Date().getFullYear();
    let months: string[] = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] 
    

    if (!month) {
      services = await this.serviceRepository.find({
        relations: {
          client: true,
         invoice: {
            payment:true
          }
        },
        where: [{
          enabled: true,
          status: 'Cerrado',
          invoice: {
            payment: {
              paymentMethod: 'Cash',
            }
          }
        }],
      }).then((result: any) => {
        return result; // tal vez debamos manipular estos datos antes de mandar al front
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });

    } else {

      let whereClause: { enabled: boolean, status: string, invoice?: { invoiceDate?:any, payment?:{ paymentMethod?:any } }}[] = [];
      if(month){
        let currentMonth = months.indexOf(month)+1;
        const startDate = new Date(currentYear.toString() + '-' + currentMonth + '-01');
        const endDate = new Date(currentYear.toString() + '-' + currentMonth + '-31');
        
        whereClause.push({
          enabled: true,
          status: 'Cerrado',
          invoice: {
            invoiceDate:  Between(startDate, endDate),
            payment: {
              paymentMethod: 'Cash'
            }
          }
        })
        
      }

      services = await this.serviceRepository.find({
        relations: {
          client: true,
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
      //console.log('en el if con tipo ' + clntType + ' y extra es ' + extra)
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
      //console.log('en el else with ' + clntType)
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