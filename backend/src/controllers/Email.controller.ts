import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { EmailService } from 'src/services/Email.service';
import { Response } from 'express';
import { ServiceDto } from 'src/dto/Service.dto';
import { EntityConfiguration } from 'src/entities/Configuration.entity';

@Controller({ version: '1', path: 'mail' })
export class EmailController {
  exceptions: any;
   createConfig: EntityConfiguration;
   
  constructor(private readonly appService: EmailService) { }

  @Post('/send')
  sendEmail(@Body() ServiceDto: ServiceDto) {

    return this.appService.sendMail(ServiceDto);
  }

    @Get()
    findAll(): Promise<EntityConfiguration[]> {
      return this.appService.findAll();
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
  async generateInvoice(@Body() entity: ServiceDto, @Res() res: Response) {
    const pdfBytes = await this.appService.generateInvoice(entity);

    
      res.setHeader('Content-Type', 'application/pdf');
      //res.setHeader('Content-Disposition', 'attachment; filename='+ entity.invoice?.invoiceName);
      res.send(Buffer.from(pdfBytes));
    
  }

  private isNotPromise<T>(value: T | Promise<T>): value is T {
    return !(
      value !== null &&
      typeof value === 'object' &&
      typeof (value as any).then === 'function'
    );
  }

  @Post('/notify')
  async enableNotification(@Query('enable') enableNotification: string,@Query('onDate') enableOnDate: string, @Res({ passthrough: true }) res: Response) {

    let resp = this.appService.enableNotifications(enableNotification,enableOnDate);
    
     return resp;
  }

    @Post('/config')
    async create(@Body() configuration: EntityConfiguration) {
  
      console.log('Llega a Email.controller: '+ JSON.stringify(configuration));
      try {
        this.createConfig = configuration;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while creating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      return await this.appService.create(this.createConfig)
        .then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          console.log("entra al catch: ", error);
          this.exceptions.sendException(error);
        });
    }
}
