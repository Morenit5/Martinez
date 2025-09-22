import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../entities/Service.entity';
import { CreateServiceDto, ServiceDto, UpdateServiceDto } from '../dto/Service.dto';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class ServiceService {
  private transporter;

  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>, private readonly exceptions: TypeORMExceptions) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // tu servidor SMTP
      port: 587,
      encryption: 'TLS',
      secure: false,
      auth: {
        user: '', // ⚠️ Poner correo válido
        pass: '',     // ⚠️ Contraseña de aplicación
      },
    });

    const mailOptions = {
      from: '',
      to: "",
      subject: "Envío de Factura Martínez",
      text: "Adjunto al correo encontrará en archivo PDF la Factura correspondiente a su servicio.",
      html: '<p>Adjunto al correo encontrará en archivo PDF la Factura correspondiente a su servicio.</p>',
      attachments: [
        {
          filename: 'FACTURA.pdf',
          path: path.join(__dirname, '..', 'pdfs', 'FACTURA.pdf'), // Ruta absoluta
          contentType: 'application/pdf',
        },
      ],
    };
  }


  async findAll(): Promise<ServiceDto[]> {
    var services: ServiceDto[] = await this.serviceRepository.find({ 
      where: [{ enabled: true } ],
      relations: {
        client: true,
        serviceDetail:true,
        invoice: {
          payment:true,
          invoiceDetails:true
        }
      }
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

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
            invoiceDetails: true
          }
        },
        where: [{
          enabled: true,
          isExtra: true,
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
            invoiceDetails: true
          }
        },
        where: [{
          enabled: true,
          isExtra: false,
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
          invoiceDetails: true
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
}