import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/services/Email.service';
import { Response } from 'express';
import { EntityConfiguration } from 'src/entities/Configuration.entity';
import { ConfigurationDto } from 'src/dto/Configuration.dto';
import { ConfigurationService } from 'src/services/Configuration.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceService } from 'src/services/Service.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'configuration' })
export class ConfigurationController {
    

    constructor(private readonly confService: ConfigurationService, private readonly appService: EmailService,
        private readonly service: ServiceService, private readonly exceptions: TypeORMExceptions) { }

    @Get()
    findAll(): Promise<EntityConfiguration[]> {
      return this.confService.findAll();
    }


    @Get('/notify/status')
    async getNotificationsStatus(@Res({ passthrough: true }) res: Response) {

        let resp = this.appService.getNotificationStatus();
        return resp;
    }


    @Post('/notify')
    async enableNotification(@Query('enable') enableNotification: string, @Query('onDate') enableOnDate: string, @Res({ passthrough: true }) res: Response) {

        let resp = this.appService.enableNotifications(enableNotification, enableOnDate);

        return resp;
    }

    @Post('/config')
    async create(@Body() configuration: ConfigurationDto) {
        let enableNotification;
        let enableOn;
        let enableInvoiceRecurrent;

        let confUpdated = await this.confService.create(configuration).then((result: any) => {
            
            return result;
        }).catch((error: any) => {
            
            this.exceptions.sendException(error);
        }); 

        let entitiyConf :EntityConfiguration = JSON.parse(JSON.stringify(confUpdated));
        enableOn = entitiyConf.enableOnDate;
        enableNotification =  entitiyConf.enableNotification;
        enableInvoiceRecurrent = entitiyConf.isInvoiceAutomatically;

        
        await this.service.enableDisableInvoiceCreation(enableInvoiceRecurrent.toString());
        
        
        await this.appService.enableNotifications(enableNotification.toString(), enableOn.toString());
        
        

        return confUpdated;


    }
}
