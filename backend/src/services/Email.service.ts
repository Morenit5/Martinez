import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { ServiceDto } from 'src/dto/Service.dto';

enum EmailOptions {
  subject = "Envío de Factura Martínez",
  text = "Adjunto al correo encontrará en archivo PDF la Factura correspondiente a su servicio.",
  html = '<p>Adjunto al correo encontrará en archivo PDF la Factura correspondiente a su servicio.</p>'
}

@Injectable()
export class EmailService {

  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // tu servidor SMTP
      port: 587,
      encryption: 'TLS',
      secure: false,
      auth: {
        user: 'francisco.usa.227@gmail.com', // ⚠️ Poner correo válido
        pass: 'xmwzwuxotnqpvmjp',     // ⚠️ Contraseña de aplicación
      },
    });

    const mailOptions =
    {
      from: 'francisco.usa.227@gmail.com',
      to: "rejon.yesenia@gmail.com",
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

  async sendMail(entity: ServiceDto) {
    var variable: ServiceDto= plainToInstance(ServiceDto,entity);

    //var correo = JSON.stringify(entity.client.email);
    //console.log('CORREOoooooooooooo: '+correo);
    //let v2= JSON.stringify(entity);
    //console.log(variable);
    //console.log(JSON.parse(v2));
    // Ruta del PDF en el servidor
    //const filePath3 = path.join(__dirname, '..', 'invoices', 'FACTURA.pdf');
    //console.log(filePath3);
    let invoice = entity.invoice?.invoiceName || '';
    //console.log( JSON.stringify(variable.client.email));
    //console.log( JSON.stringify(v2));
    const filePath = path.resolve(process.cwd(), 'src', 'invoices', 'YeseniaRejon-20250824.pdf');
    //const filePath2 = path.resolve(process.cwd(), 'src', 'invoices', invoice); /*'YeseniaRejon-20250824.pdf');*/
    const info = await this.transporter.sendMail({
      from: 'francisco.usa.227@gmail.com',
      to: variable.client.email,//entity.client.email,
      subject: EmailOptions.subject,
      text: EmailOptions.text,
      html: EmailOptions.html,
      attachments: [
        {
          filename: entity.invoice?.invoiceName, //'YeseniaRejon-20250824.pdf',
          path: filePath, // Ruta absoluta
          contentType: 'application/pdf',
        },
      ],
    });

    return { message: 'Factura enviada', info };
  }

  getHello(): string {
    return 'Hello World!';
  }

  async generateInvoice(entity: ServiceDto) {

  }
}