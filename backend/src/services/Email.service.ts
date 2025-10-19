import { ConsoleLogger, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { EntityService } from 'src/entities/Service.entity';
import * as fs from 'fs';
import { ServiceDetailDto } from 'src/dto/ServiceDetail.dto';
import { CronJob } from 'cron';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { Between, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDto } from 'src/dto/Service.dto';

enum EmailOptions {
  subject = "Martinez Gardening Invoice",
  text = "Please find attached the PDF document outlining the service provided. It includes all the relevant details regarding prices and details of each service.",
  html = '<p>Please find attached the PDF document outlining the service provided. It includes all the relevant details regarding prices and details of each service.</p>'
}

enum EmailReminderOptions {
  subject = 'Friendly Reminder: Upcoming Service Due ',
  html1 = '<p>Hello<br></p>',
  html2 = '<p>I hope you are doing well! This is just a friendly reminder that the service we are providing for you is due in 3 days.<br></p>',
  html3 = '<p>If you have any questions or need anything from us before then, feel free to reach out. We are here to help.<br><br><br></p>',
  html4 = '<p>Thanks again for choosing Martínez Gardening. <br> We appreciate the opportunity to work with you!<br><br><br></p>',
  html5 = 'Warm regards, <br> Omar Martínez.' 
}

@Injectable()
export class EmailService {

  private transporter;
  cronJob: CronJob;
  onDate:number;

  constructor(@InjectRepository(EntityService) private serviceRepository: Repository<EntityService>, private readonly exceptions: TypeORMExceptions){
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
  }

  enableNotifications(enable: string, enableOnDate: string): {} {
    let resp:{active:boolean, message:any} = {active:false, message:''};
    const finalValue: boolean = enable.toLocaleLowerCase() === 'true';
    this.onDate = Number(enableOnDate);

    let x:number = 10;
    const schedule = `0 0 13 ${this.onDate} * *`;
    const forTesting = `0 */${x} * * * *`;

    try {
      if (this.cronJob == null || this.cronJob == undefined) {
        this.cronJob = new CronJob(forTesting, async () => {
          try {
            await this.checkUnpaidServices();
            console.log('Correos aparentemente enviados correctamente')
          } catch (e) {
            console.error(e);
          }
        });
      }

      if (finalValue == true) {
        if (!this.cronJob.isActive) {
          this.cronJob.start();
        }
      }
      if (finalValue == false) {
        this.cronJob.stop();
      }
      return {active:true, message:'notificaciones habilitadas'};
    }
    catch (error) {
      return {active:false, message:'error al tratar de habilitar las notificaciones'};
    }
  }

  getNotificationStatus():{} {
    let resp:{active:boolean, notifyOnDate:any} = {active:false, notifyOnDate:''};
    if(this.cronJob == undefined || this.cronJob == null){return resp;}
    
    let isActive = this.cronJob.isActive;
    if(isActive){
       resp = {active:true, notifyOnDate:this.onDate};
    }else{
       resp = {active:false, notifyOnDate:''};
    }
    return resp;
  }


  async checkUnpaidServices(): Promise<void>{
    //const today = new Date().toISOString().slice(0, 10);
    let mails:string[] = [];
    let serviceList = await this.findAllUnpaidServices();
    
    serviceList.forEach(entity => {
      var serviceIstance: EntityService = plainToInstance(EntityService, entity);
      mails.push(serviceIstance.client.email);
    });

    if(mails.length > 0){
      this.sendReminderMail(mails);
    }
    
  }

  async findAllUnpaidServices(): Promise<ServiceDto[]> {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth()+1;

    const startDate = new Date(currentYear.toString() + '-' + currentMonth.toString() + '-01');
    const endDate = new Date(currentYear.toString() + '-' + currentMonth.toString() + '-31');
   

    var services: ServiceDto[] = await this.serviceRepository.find({
      relations: {
        client: true,
      },
      where: [{
        enabled: true,
        status: 'Recurrente',
        invoice: {
          payment: {
            isServicePaid: false,
            paymentDate: Between(startDate, endDate),
          }
        }
      }],
    }).then((result: any) => {
      return result; // tal vez debamos manipular estos datos antes de mandar al front
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });

    return services;
  }

  async sendReminderMail(emailList:string[] = [] ) {
     const body = EmailReminderOptions.html1 + EmailReminderOptions.html2 + EmailReminderOptions.html3 + EmailReminderOptions.html4 + EmailReminderOptions.html5;
      await this.transporter.sendMail({
        from: 'francisco.usa.227@gmail.com',
        to: 'francisco.usa.227@gmail.com',
        bcc: emailList,
        subject: EmailReminderOptions.subject,
        html: body,
      });
      return;
  }

  async sendMail(entity: ServiceDto) {

    
    const filePath = path.join(__dirname, '..', 'invoices'); // Or any other desired directory
    console.log('FilePath:  '+filePath);

    const invoiceName: string=entity.invoice?.invoiceName || 'YeseniaRejon-20250824.pdf';
console.log("ENTITY: "+ JSON.stringify(entity));

    const info = await this.transporter.sendMail({
      from: 'francisco.usa.227@gmail.com',
      to: entity.client.email,
      subject: EmailOptions.subject,
      text: EmailOptions.text,
      html: EmailOptions.html,
      attachments: [
        {
          filename: entity.invoice?.invoiceName, //'YeseniaRejon-20250824.pdf',
          path: path.join(__dirname, '..', 'invoices', invoiceName), // Ruta absoluta
          contentType: 'application/pdf',
        },
      ],
    });

    return { message: 'Factura enviada', info };

  }

  getClientInvoice(fileName: string) {
    const filePath = path.join(__dirname, '..', 'invoices', fileName); // Or any other desired directory
    return fs.promises.readFile(filePath);
  }


  async generateInvoice(service: ServiceDto) {

    // Crear documento PDF
    const pdfDoc = await PDFDocument.create();

    // Configuración de página
    const pageWidth = 612;   // A4 ancho - 595
    const pageHeight = 792;  // A4 alto - 842
    const margin = 70;

    // Crear primera página
    let page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Crear documento PDF
    const { height } = page.getSize();
    let y = height - 50;

    // Fuentes
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // === Cargar logo desde backend/assets/logo.png ===
    const logoPath: string = path.join(__dirname, '..', 'invoiceimages', 'logo.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.04);

    // Insertar logo
    page.drawImage(logoImage, {
      x: 60,
      y: height - 90,
      width: logoDims.width,
      height: logoDims.height,
    });

    // === Encabezado ===
    page.drawText('I', {
      x: margin + 310, y: pageHeight - margin, size: 45, color: rgb(128 / 255, 128 / 255, 128 / 255),/*rgb(0, 0.6, 0),*/ font: timesRomanBold // verde
    });
    page.drawText('NVOICE', {
      x: margin + 330, y: pageHeight - margin, size: 35, color: rgb(128 / 255, 128 / 255, 128 / 255),/*rgb(0, 0.6, 0),*/ font: timesRomanBold // verde
    });

    // Línea verde bajo el título
    page.drawLine({
      start: { x: margin, y: pageHeight - margin - 15 },
      end: { x: pageWidth - margin, y: pageHeight - margin - 15 },
      thickness: 2,
      color: rgb(128 / 255, 128 / 255, 128 / 255),//color: rgb(0, 0.4, 0),
    });
    page.drawLine({
      start: { x: 0, y: 70 },       // inicio (abajo)
      end: { x: 0, y: pageHeight - 70 }, // fin (arriba)
      thickness: 20,
      color: rgb(0, 0.6, 0), // verde
    });
    page.drawLine({
      start: { x: 0, y: 0 },       // inicio (abajo)
      end: { x: 0, y: pageHeight }, // fin (arriba)
      thickness: 40,
      color: rgb(0, 0.6, 0), // verde
    });

    //
    const meses = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const fecha = new Date();
    const mesActual = meses[fecha.getMonth()]; // getMonth() devuelve 0-11
    let fechaActual = mesActual + ` ${fecha.getDate()}, ${fecha.getFullYear()}`;

    y -= 60;
    // === Datos del cliente ===
    page.drawText("INVOICE TO:", { x: 70, y, size: 12, font: timesRomanBold });
    y -= 15;
    page.drawText("Client: " + service.client?.name + ' ' + service.client.lastName/**/, { x: 70, y, size: 10, font: timesRoman });
    y -= 15;
    page.drawText("Phone: " + service.client.phone, { x: 70, y, size: 10, font: timesRoman });
    y -= 15;
    page.drawText("Address: " + service.client.address, { x: 70, y, size: 10, font: timesRoman });
    y -= 15;
    page.drawText("Invoice Date: " + fechaActual, { x: 70, y, size: 10, font: timesRoman });

    // Assuming you have a UUID string
    const invoiceNumber = service.invoice?.invoiceNumber.substring(service.invoice?.invoiceNumber.lastIndexOf('-') + 1, service.invoice?.invoiceNumber.length);

    // === Datos de la empresa ===
    y -= -60;//40;
    page.drawText("COMPANY:", { x: 415, y, size: 12, font: timesRomanBold });
    y -= 15;
    page.drawText("MARTINEZ GARDENING", { x: 415, y, size: 10, font: timesRoman });
    y -= 15;
    page.drawText("# de Cédula: ", { x: 415, y, size: 10, font: timesRoman });
    y -= 15;
    page.drawText("Invoice Number: " + invoiceNumber, { x: 415, y, size: 10, font: timesRoman });

    page.drawRectangle({
      x: 70,
      y: 520,
      width: 480,
      height: 20, //25
      borderColor: rgb(128 / 255, 128 / 255, 128 / 255),
      //color: rgb(0, 0, 0),
      borderWidth: .5,
    });

    y -= 45;
    page.drawText("SERVICE: " + service.serviceName, { x: 73, y: 526, size: 10, font: timesRomanBold });

    /////////////////////
    // 🔹 Función para envolver texto
    function wrapText(text: string) {

      let desc = text;//;"esto es la descripcion que cuenta con un chiingo de palabras que tenemos que subdividir usando el carriage return para formar filas de 30 caracteres"
      const descArray: string[] = desc.split(' ');
      let frase = '';
      let fraseL = frase.length;
      let maxL = 45;
      for (let i = 0; i < descArray.length; i++) {
        const sumatoria = fraseL + descArray[i].length;
        //console.log('sumatoria ' + sumatoria)
        if (sumatoria < maxL) {
          frase += descArray[i] + ' ';
        } else {
          frase += '\n' + descArray[i] + ' ';
          maxL += 45;
        }
        fraseL = frase.length;
      } // termino del For
      return frase;
    }

    /////////////////////
    // === Tabla de productos ===
    y -= 70;
    const headers = ['Type', 'Description', 'Unit', 'Quantity', 'Price'];
    const colWidths = [100, 200, 50, 60, 70];
    const rowHH = 18;
    const rowHeight = 12.5;
    let startX = 70;

    // Dibujar encabezados
    let currentX = startX;
    headers.forEach((header, i) => {
      page.drawRectangle({
        x: currentX,
        y: y - rowHH,
        width: colWidths[i],
        height: rowHH,
        borderColor: rgb(128 / 255, 128 / 255, 128 / 255),// rgb(0, 0, 0),
        color: rgb(0, 128 / 255, 0),
        borderWidth: .5,
      });
      page.drawText(header, {
        x: currentX + 5,
        y: y - 12,
        size: 10,
        color: rgb(1.0, 1.0, 1.0),
        font: timesRomanBold
      });
      currentX += colWidths[i];
    });

    y = 504; //aqui el valor es 497 // los 50 son del servicio y header

    let yDesc = 0;
    let numFilas;
    let firstTime: boolean = true;
    let fontSize = 9;

    service.serviceDetail.forEach((p: ServiceDetailDto) => {
      if (firstTime == true) { firstTime = false; }

      let descWrap = wrapText(p.description);
      numFilas = descWrap.length < 46 ? 1 : descWrap.length > 92 ? 3 : 2;

      const column = [
        p.serviceType,
        descWrap,//p.description,
        p.unitMeasurement,
        p.quantity,
        `$${p.price.toFixed(2)}`,
      ];

      currentX = startX;
      column.forEach((cell, i) => {
        page.drawRectangle({
          x: currentX,
          y: y,
          width: colWidths[i],
          height: -(rowHeight * numFilas),
          borderColor: rgb(128 / 255, 128 / 255, 128 / 255),
          borderWidth: .5,
        });
        page.drawText(cell.toString(), {
          x: currentX + 5,
          y: y - 9, // 447 si i es = a 1 descripcion ponle 10, si no, le pones los 17 
          size: fontSize,
          font: timesRoman,
          maxWidth: 200, // This is the key for text wrapping
          lineHeight: fontSize * 0.9, // Adjust line height for better readability
        });
        currentX += colWidths[i];
      }); //termina el recorrido de las columnas

      if (!firstTime) { y -= rowHeight * numFilas; }
    }); // termino del foreach de las filas
    firstTime = true; // se resetea la bandera para la siguiente tanda

    let tax = service.invoice?.payment[0].taxAmount;
    if (tax == null) { tax = 0; }

    // === Totales ===
    y -= 50;
    page.drawText("Subtotal: $" + service.invoice?.payment[0].paymentAmount.toFixed(2), { x: 440, y, size: 12, font: timesRoman });
    y -= 15;
    page.drawText("Tax:        $" + tax.toFixed(2), { x: 440, y, size: 12, font: timesRoman });
    y -= 15;
    page.drawText("Total:     $" + service.invoice?.totalAmount.toFixed(2), { x: 440, y, size: 12, color: rgb(0, 0, 0), font: timesRomanBold });

    let method;
    method = service.invoice?.payment[0].paymentMethod;
    const traductions: Record<string, string> = {
      Efectivo: "Cash",
      Transferencia: "Transfer",
      Cheque: "Check",
      Deposito: "Deposit",
    };

    // Función para traducir
    function traducirMetodoPago(metodo: string): string {
      return traductions[metodo] || metodo; // Si no existe, devuelve el original
    }

    if (tax != undefined || tax != null) {
      if (tax > 0) {

        y -= 15;
        page.drawText(`Payment made through: ${traducirMetodoPago(method)}.`,
          { x: 70, y, size: 12, color: rgb(0, 0, 0), font: timesRoman });
      }
    }
    else {
      y -= 15;
      page.drawText(" ");
    }

    // Guardar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const fileName = service.invoice ? service.invoice.invoiceName : 'example.pdf';

    const uploadDir: string = path.join(__dirname, '..', 'invoices'); // Or any other desired directory

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath: string = path.join(uploadDir, fileName);

    try {
      fs.writeFileSync(filePath, pdfBytes);
      console.log(`PDF document "${fileName}" saved successfully to ${filePath}`);
    } catch (error) {
      console.error(`Error saving PDF document: ${error}`);
    }
    return pdfBytes;
  }
}