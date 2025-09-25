import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { EntityService } from 'src/entities/Service.entity';
import * as fs from 'fs';

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
    var variable: EntityService= plainToInstance(EntityService,entity);

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
    var variable: EntityService= plainToInstance(EntityService, service);

   // Crear documento PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 📋 Datos de ejemplo (productos)
    const productos = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      nombre: `Service ${i + 1}`,
      cantidad: Math.floor(Math.random() * 5) + 1,
      precio: (Math.random() * 500 + 100).toFixed(2),
    }));

    // Configuración de página
    const pageWidth = 612;//595;   // A4 ancho
    const pageHeight = 792;//842;  // A4 alto
    const margin = 70;
    const lineHeight = 20;
    const maxRowsPerPage = 25; // filas por página

    let currentY = pageHeight - margin - 80; // espacio para encabezado
    let rowCount = 0;

    // Crear primera página
    let page = pdfDoc.addPage([pageWidth, pageHeight]);

//
 // Crear documento PDF
// Si tienes un logo en base64 puedes importarlo o pegarlo aquí
const logoBase64 = "data:image/png;base64,..."; // coloca aquí tu logo en base64
  const { height } = page.getSize();

  let y = height - 50;

  // === Logo ===
  /*if (logoBase64) {
    const logoBytes = Uint8Array.from(atob(logoBase64.split(',')[1]), c => c.charCodeAt(0));
    const logoImage = await pdfDoc.embedPng(logoBytes);
    page.drawImage(logoImage, {
      x: 50,
      y: y - 60,
      width: 100,
      height: 50,
    });
  }*/

  // === Encabezado ===
    page.drawText('INVOICE', { x: margin+290, y: pageHeight - margin, size: 45, color: rgb(0, 0.6, 0), // verde
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
  end: { x: 0, y: pageHeight-70 }, // fin (arriba)
  thickness: 20,
  color: rgb(0,0.6,0), // verde
});
        page.drawLine({
  start: { x: 0, y: 0 },       // inicio (abajo)
  end: { x: 0, y: pageHeight }, // fin (arriba)
  thickness: 40,
  color: rgb(0, 0.6, 0), // verde
});

  y -= 60;
  // === Datos del cliente ===
  page.drawText("INVOICE TO:", { x: 70, y, size: 12 });
  y -= 15;
  page.drawText("Client: "+ variable.client?.name + ' ' + service.client.lastName/**/, { x: 70, y, size: 10 });
  y -= 15;
   page.drawText("RFC: JUPX800101XXX", { x: 70, y, size: 10 });
  y -= 15;
  page.drawText("Address: "/* + entity.client.address*/, { x: 70, y, size: 10 });

  // === Datos de la empresa ===
  y -= -45;//40;
  page.drawText("COMPANY:", { x: 480, y, size: 12, font: undefined });
  y -= 15;
  page.drawText("RFC: XYZ010101ABC", { x: 440, y, size: 10 });
  y -= 15;
  page.drawText("Dirección: Calle Falsa 456, Ciudad", { x: 390, y, size: 10 });


   // === Tabla de productos ===
  y -= 70;
  const headers = ['Type', 'Description', 'Unit Price', 'Quantity', 'Price'];
  const rows = [
    ['Laptop', '1','10000', '$15,000.00', '$15,000.00'],
    ['Mouse', '2','10000', '$300.00', '$600.00'],
    ['Teclado', '1','10000', '$500.00', '$500.00'],
  ];

  const colWidths = [100, 80, 100, 100, 100];
  const rowHeight = 25;
  let startX = 70;

 // Dibujar encabezados
  let currentX = startX;
  headers.forEach((header, i) => {
    page.drawRectangle({
      x: currentX,
      y: y - rowHeight,
      width: colWidths[i],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    page.drawText(header, { x: currentX + 5, y: y - 18, size: 12 });
    currentX += colWidths[i];
  });

  y -= rowHeight;

  // Dibujar filas
  rows.forEach(row => {
    currentX = startX;
    row.forEach((cell, i) => {
      page.drawRectangle({
        x: currentX,
        y: y - rowHeight,
        width: colWidths[i],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      page.drawText(cell, { x: currentX + 5, y: y - 18, size: 12 });
      currentX += colWidths[i];
    });
    y -= rowHeight;
  });

  // === Totales ===
  y -= 30;
  page.drawText("Subtotal: $16,100.00", { x: 440, y, size: 12 });
  y -= 15;
  page.drawText("Tax: $2,576.00", { x: 470, y, size: 12 });
  y -= 15;
  page.drawText("Total: $18,676.00", { x: 440, y, size: 14, color: rgb(0, 0, 0) });

    // Guardar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });

    //const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });   // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

     /*document.addEventListener('DOMContentLoaded', () => {
            // Access document here
            const a = document.createElement('a');
    a.href = url;
    const invoiceName = /*entity.client.name + entity.client.lastName+ '-' +* /anio+'-'+ mesConCeros+'.pdf';
    a.download = invoiceName;//'factura.pdf';
    a.click();
        });*/
    /*const a = document.createElement('a');
    a.href = url;
    const invoiceName = service.client.name + service.client.lastName+ '-' +anio+'-'+ mesConCeros+'.pdf';
    a.download = invoiceName;//'factura.pdf';
    a.click();
    URL.revokeObjectURL(url);
   // saveAs(blob, 'factura.pdf');*/
   const fileName = variable.invoice? variable.invoice.invoiceName:'example.pdf';
   console.log('FILENAME '+fileName);
const uploadDir: string = path.join(__dirname,'..', 'invoices'); // Or any other desired directory

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