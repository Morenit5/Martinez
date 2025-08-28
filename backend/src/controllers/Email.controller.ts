import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceDto } from 'src/dto/Service.dto';
import { EmailService } from 'src/services/Email.service';

@Controller({ version: '1', path: 'mail' })
export class EmailController {
  constructor(private readonly appService: EmailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/send')
  sendEmail(@Body() ServiceDto : ServiceDto) 
  {
    console.log(JSON.stringify(ServiceDto));
    return this.appService.sendMail(ServiceDto);
  }
}
