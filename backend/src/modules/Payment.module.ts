import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePayment } from 'src/services/Payment.services';
import { ControllerPayment } from 'src/controllers/Payment.controller';
import { EntityPayment } from 'src/entities/Payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityPayment])],
  providers: [ServicePayment],
  exports: [ServicePayment],
  controllers: [ControllerPayment],
})
export class PaymentModule {}