import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EmailService } from 'src/services/Email.service';
import { Response } from 'express';
import { EntityService } from 'src/entities/Service.entity';

@Controller({ version: '1', path: 'mail' })
export class EmailController {
  constructor(private readonly appService: EmailService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/send')
  sendEmail(@Body() ServiceDto: EntityService) {
    console.log(JSON.stringify(ServiceDto));
    return this.appService.sendMail(ServiceDto);
  }

  @Get('/invoice')
  async getClientInvoice(@Query('name') name: string, @Res() res: Response) {
    const pdfBuffer = await this.appService.getClientInvoice(name);

    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename='+ entity.invoice?.invoiceName);
    res.send(Buffer.from(pdfBuffer));

  }

  @Post('/download')
  async generateInvoice(@Body() entity: EntityService, @Res() res: Response) {
    const pdfBytes = await this.appService.generateInvoice(entity);

    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename='+ entity.invoice?.invoiceName);
    res.send(Buffer.from(pdfBytes));

  }
}
