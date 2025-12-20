import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, FindOperator, ILike, In, Not, Or, Raw, Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CronJob } from 'cron';
import { CreatePaymentDto } from 'src/dto/Payment.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from 'src/dto/Invoice.dto';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { ConfigurationDto, createConfigurationDto } from 'src/dto/Configuration.dto';
import { EntityInvoice } from 'src/entities/Invoice.entity';
import { EmailService } from './Email.service';


@Injectable()
export class ServiceService {
  cronJob: CronJob;
  months: string[] = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>, 
              @InjectRepository(EntityConfiguration) private configurationRepository: Repository<EntityConfiguration>,
              @InjectRepository(EntityInvoice) private invoiceRepository: Repository<EntityInvoice>,
               private readonly exceptions: TypeORMExceptions) { 
   
    console.log('Llegando al constructor');
    this.configurationRepository.find({ 
      where: [{ 
        enabled: true,
      } ],
    }).then((Configurations : any) => {
      console.log('Configurations:  '+ JSON.stringify(Configurations));
      for(const config of Configurations ){
        if(config.isInvoiceAutomatically == true || config.isInvoiceAutomatically == 'true' ){
          this.enableDisableInvoiceCreation('true'); 
        }
      }
     }).catch((error: any) => {
      this.exceptions.sendException(error);
    });
  }


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

  async findAllRecurrentServices(): Promise<ServiceDto[]> {

    var services: ServiceDto[] = await this.serviceRepository.find({
      where: [{
        enabled: true,
        status: 'Recurrente',

      }],
    }).then((result: any) => {
      console.log('Todos los servicos recurrentes activos: '+JSON.stringify(result));
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }

  create(service: CreateServiceDto): Promise<ServiceDto> {
    return this.serviceRepository.save(service);
  }


  async update(serviceId: number, entity: UpdateServiceDto): Promise<ServiceDto | null> {
    
    entity.serviceDetail = entity.serviceDetail!.map((child) => {
      if (!child.id) {
        delete child.serviceDetailsId;
      }
      return child;
    });
    await this.serviceRepository.save(entity);
    return this.serviceRepository.findOneBy({ serviceId })
    
  }

   async generateInvoice(serviceId: number, entity: UpdateServiceDto): Promise<ServiceDto | null> {
    
    let invoice= new UpdateInvoiceDto();
    invoice = entity.invoice![0];
    invoice.service =new UpdateServiceDto();
    invoice.service.serviceId= serviceId;

     await this.invoiceRepository.save(invoice);
    return this.serviceRepository.findOneBy({ serviceId })
    
  }


  async findAllEnabled(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({
      where: [{
        enabled: true
      }],
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }


  async enableDisableInvoiceCreation(enable: string): Promise<{}> {

    const finalValue: boolean = enable.toLocaleLowerCase() === 'true';
    let x: number = 15;
    //const schedule = `0 0 6 1 * *`;  // el primero de cada mes a las 6 de la mañana
    const forTesting = `0 */${x} * * * *`;  //cada 10 minutos

    try {
      if (this.cronJob == null || this.cronJob == undefined) {
        this.cronJob = new CronJob(forTesting, async () => {
          try {
            await this.updateServiceInvoice();
            
          } catch (e) {
            console.error(e);
          }
        });
      }

      if (finalValue == true) {
        if (!this.cronJob.isActive) {
          this.cronJob.start();

          console.log('ya fue activado el cron job para crear las nuevas facturas')
        }
      }
      if (finalValue == false) {
        this.cronJob.stop();
        console.log('ya fue desactivado el cron job para no crear nuevas facturas')
      }

      let configs: createConfigurationDto;// = new createConfigurationDto();
      let currentCofig = await this.findCurrentConfigurations();

      for (const conf of currentCofig) {
        configs = new createConfigurationDto();
        configs.configurationId = conf.configurationId;
        configs.email = conf.email;
        configs.enabled = true;
        configs.isInvoiceAutomatically = finalValue;
        configs.password = conf.password;

        this.configurationRepository.save(configs);
      }

      return { active: true, message: 'invoice creado' };
    }
    catch (error) {
      return { active: false, message: 'error al tratar de crear el invoice' };
    }
  }


  async findCurrentConfigurations(): Promise<EntityConfiguration[]> {
    var conf: ConfigurationDto[] = await this.configurationRepository.find({
      where: [{
        enabled: true,
      }],
    }).then((result: any) => {
      //console.log(result);
      return result; // tal vez debamos manipular estos datos antes de mandar al front

    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return conf;
  }
  
  async updateServiceInvoice(): Promise<void> {
 
    //let serviceIds: number[] = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()+1;
    const currentFullYear = currentDate.getFullYear();
    let invoiceDate = currentFullYear +'-'+currentMonth;
    let serviceList = await this.findAllRecurrentServices();

    for(const serviceInst of serviceList ){

      
      //revisar si existe la factura del mes, sino, crearla
      let existsInvoice = await this.findInvoiceByMonth(serviceInst.serviceId, invoiceDate);
      
      if(existsInvoice && existsInvoice.exists == true){
        console.log('La factura para service id: '+ serviceInst.serviceId + ' con  invoice date: ' +invoiceDate + ' ya existe, no hay nada que generar');
      }
      
      if (existsInvoice && existsInvoice.exists == false) {
        await this.createAutomaticNewInvoice(serviceInst);
      }      
    }
  }

  private async createAutomaticNewInvoice(service: ServiceDto): Promise<ServiceDto|null>{
    const currentDate = new Date();//.toISOString().slice(0, 10); //en teoria debe ser ==> año/mes/01 ya que se genera cada primero de mes
    const currentMonthIndex: number = new Date().getMonth();
    let chosenMonth =  this.months[currentMonthIndex]; 
    
    
    let paymentItem: CreatePaymentDto = new CreatePaymentDto();
    paymentItem.paymentDate = currentDate,
    paymentItem.paymentAmount = 0;
    paymentItem.paymentMethod = 'none';
    paymentItem.taxAmount = 0;
    paymentItem.paymentStatus = 'Por_Pagar';
   

    let invoiceItem: CreateInvoiceDto = new CreateInvoiceDto();
    invoiceItem.invoiceDate = currentDate;
    invoiceItem.invoiceNumber = '1';
    invoiceItem.invoiceName = 'initial_invoice_name';
    invoiceItem.totalAmount = 0;
    invoiceItem.subtotalAmount = 0;
    invoiceItem.invoicedMonth = chosenMonth;
    invoiceItem.invoiceStatus = 'Por_Pagar';
    invoiceItem.payment = [paymentItem];
    invoiceItem.service =new UpdateServiceDto();
    invoiceItem.service!.serviceId =service.serviceId;
    

   /* let serviceUp :UpdateServiceDto = new UpdateServiceDto();
    serviceUp.serviceId = service.serviceId;
    serviceUp.invoice = [invoiceItem];
    
    let invoice= new UpdateInvoiceDto();
    invoice = entity.invoice![0];
    invoice.service =new UpdateServiceDto();
    invoice.service.serviceId= serviceId;*/

    let variable : number=service.serviceId;
    await this.invoiceRepository.save(invoiceItem);
    console.log('Factura automatica creada correctamente..')
    return this.serviceRepository.findOneBy({ serviceId: variable })

    //return this.serviceRepository.save(serviceUp);
  }

    getAutoInvoiceStatus():{} {
    let resp:{active:boolean} = {active:false};
    if(this.cronJob == undefined || this.cronJob == null){return resp;}
    
    let isActive = this.cronJob.isActive;
    if(isActive){
       resp = {active:true};
    }else{
       resp = {active:false};
    }
    return resp;
  }

  
    async findInvoiceByMonth(serviceId: number, invoiceDate: string): Promise<{exists}|void> {
      
      let serv : EntityService = new EntityService();
      serv.serviceId = serviceId;
    return await this.invoiceRepository.find({

      where: [{
        service :{
          serviceId: serviceId
        },
        invoiceDate: Raw(
      alias => `TO_CHAR(${alias}, 'YYYY-MM') = :formattedDate`,
      { formattedDate: invoiceDate }
    ),
      }],
    }).then((result: any) => {
     
      if(result.length>0)
      {
        //console.log('result tenemos algo');
        return { exists: true }; // si se encontraron resultados y se le comunica al front
      }
      else
      {
        //console.log('No hay resultados');
        return { exists: false}; // no encontró registros y se le comunica al front
      }
      //return result; 
    
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });
  }
}