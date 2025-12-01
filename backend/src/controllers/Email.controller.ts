import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/services/Email.service';
import { Response } from 'express';
import { ServiceDto } from 'src/dto/Service.dto';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'mail' })
export class EmailController {
  exceptions: any;
  createConfig: EntityConfiguration;

  constructor(private readonly appService: EmailService) { }

  @Get()
  findAll(): Promise<EntityConfiguration[]> {
    return this.appService.findAll();
  }

  @Post('/send')
  sendEmail(@Body() ServiceDto: ServiceDto, @Query('invoiceIndex') invoiceIndex: number) {

    return this.appService.sendMail(ServiceDto, invoiceIndex);
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
  async generateInvoice(@Body() entity: ServiceDto, @Query('invoiceIndex') invoiceIndex: number, @Res() res: Response) {
    const pdfBytes = await this.appService.generateInvoice(entity, invoiceIndex);


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
  async enableNotification(@Query('enable') enableNotification: string, @Query('onDate') enableOnDate: string, @Res({ passthrough: true }) res: Response) {

    let resp = this.appService.enableNotifications(enableNotification, enableOnDate);

    return resp;
  }

  @Post('/config')
  async create(@Body() configuration: EntityConfiguration) {

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
       
        this.exceptions.sendException(error);
      });
  }
}
