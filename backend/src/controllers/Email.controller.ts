import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EmailService } from 'src/services/Email.service';
import { Response } from 'express';
import { EntityService } from 'src/entities/Service.entity';
import { ServiceService } from 'src/services/Service.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';

@Controller({ version: '1', path: 'mail' })
export class EmailController {
  constructor(private readonly appService: EmailService,private readonly serviceService: ServiceService, private readonly exceptions: TypeORMExceptions) { }

  

  @Post('/send')
  sendEmail(@Body() ServiceDto: EntityService) {
    //console.log(JSON.stringify(ServiceDto));
    return this.appService.sendMail(ServiceDto);
  }

  @Get('/invoice')
  async getClientInvoice(@Query('name') name: string, @Res() res: Response) {
    const pdfBuffer = await this.appService.getClientInvoice(name);

    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename='+ entity.invoice?.invoiceName);
    res.send(Buffer.from(pdfBuffer));

  }

  @Get('/notify/status')
  async getNotificationsStatus(@Res({ passthrough: true }) res: Response) {

    let resp = this.appService.getNotificationStatus();
    return resp;
  }

  @Post('/download')
  async generateInvoice(@Body() entity: EntityService, @Res() res: Response) {
    const pdfBytes = await this.appService.generateInvoice(entity);

    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename='+ entity.invoice?.invoiceName);
    res.send(Buffer.from(pdfBytes));

  }

  @Post('/notify')
  async enableNotification(@Query('enable') enableNotification: string,@Query('onDate') enableOnDate: string, @Res({ passthrough: true }) res: Response) {

    let resp = this.appService.enableNotifications(enableNotification,enableOnDate);
    
     return resp;
  }

}
