import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { EntityService } from 'src/entities/Service.entity';
import * as fs from 'fs';
import { ServiceDetailDto } from 'src/dto/ServiceDetail.dto';

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
        user: '', // ⚠️ Poner correo válido
        pass: '',     // ⚠️ Contraseña de aplicación
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

  async sendMail(entity: EntityService) {
    var variable: EntityService = plainToInstance(EntityService, entity);

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



  async generateInvoice(service: EntityService) {

    // Crear documento PDF
    const pdfDoc = await PDFDocument.create();

    // Configuración de página
    const pageWidth = 612;   // A4 ancho - 595
    const pageHeight = 792;  // A4 alto - 842
    const margin = 70;
    const lineHeight = 20;
    const maxRowsPerPage = 25; // filas por página

    let currentY = pageHeight - margin - 80; // espacio para encabezado
    let rowCount = 0;


    function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const textWidth = font.widthOfTextAtSize(testLine, size);

        if (textWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) lines.push(currentLine);
      return lines;
    }

    // Crear primera página
    let page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Crear documento PDF
    // Si tienes un logo en base64 puedes importarlo o pegarlo aquí
    const logoBase64 = "data:image/png;base64,..."; // coloca aquí tu logo en base64
    const { height } = page.getSize();
    let y = height - 50;

    // Fuentes
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    async function loadImage(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

    // === Cargar logo desde backend/assets/logo.png ===
    const logoPath: string = path.join(__dirname, '..', 'assets','logo.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.04);

    // Insertar logo
    page.drawImage(logoImage, {
      x: 60,
      y:  height -90,
      width: logoDims.width,
      height: logoDims.height,
    });

    // === Encabezado ===
    page.drawText('INVOICE', {
      x: margin + 275, y: pageHeight - margin, size: 45, color: rgb(0, 0.6, 0), font: timesRomanBold // verde
    });

    // Línea verde bajo el título
    page.drawLine({
      start: { x: margin, y: pageHeight - margin - 15 },
      end: { x: pageWidth - margin, y: pageHeight - margin - 15 },
      thickness: 2,
      color: rgb(0, 0.4, 0),
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
    const meses = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
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

    // === Tabla de productos ===
    y -= 70;
    const headers = ['Type', 'Description', 'Unit', 'Quantity', 'Price'];
    const colWidths = [100, 200, 50, 50, 80];
    const rowHeight = 25;
    let startX = 70;
    const rowPadding = 10;

    // Dibujar encabezados
    let currentX = startX;
    headers.forEach((header, i) => {
      page.drawRectangle({
        x: currentX,
        y: y - rowHeight,
        width: colWidths[i],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        color: rgb(0, 128 / 255, 0),
        borderWidth: 1,
      });
      page.drawText(header, { x: currentX + 5, y: y - 18, size: 12, color: rgb(1.0, 1.0, 1.0), font: timesRomanBold });
      currentX += colWidths[i];
    });

   
    y -= rowHeight;
    service.serviceDetail.forEach((p: ServiceDetailDto) => {
      const row = [
        p.serviceType,
        p.description,
        p.unitMeasurement,
        p.quantity,
        `$${p.price.toFixed(2)}`,
      ];

      currentX = startX;
      row.forEach((cell, i) =>{
        page.drawRectangle({
          x: currentX,
          y: y - rowHeight,
          width: colWidths[i],
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });        
        page.drawText(cell.toString(), {
          x: currentX + 5,
          y: y - 17,
          size: 9,
          //font: times,
        });
        currentX += colWidths[i];
      });

      y -= rowHeight;
    });

    let tax = service.invoice?.payment[0].taxAmount;
    if (tax == null) { tax = 0; }

    // === Totales ===
    y -= 30;
    page.drawText("Subtotal: $" + service.invoice?.subtotalAmount.toFixed(2), { x: 440, y, size: 12, font: timesRoman });
    y -= 15;
    page.drawText("Tax:        $" + tax.toFixed(2), { x: 440, y, size: 12, font: timesRoman });
    y -= 15;
    page.drawText("Total:     $" + service.invoice?.totalAmount.toFixed(2), { x: 440, y, size: 12, color: rgb(0, 0, 0), font: timesRomanBold });

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
