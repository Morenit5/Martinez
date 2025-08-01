import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityPayment } from '../entities/Payment.entity';
import { CreatePaymentDto, PaymentDto, UpdatePaymentDto } from 'src/dto/Payment.dto';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';

@Injectable()
export class ServicePayment {
  constructor(@InjectRepository(EntityPayment) private paymentRepository: Repository<EntityPayment>,private readonly exceptions:TypeORMExceptions) {

  }

  findAll(): Promise<PaymentDto[]> {
    return this.paymentRepository.find();
  }

  findOne(paymentId: number): Promise<PaymentDto | null> {
    return this.paymentRepository.find({
      where: { paymentId: paymentId },
      relations: {
        invoice: {
          invoiceDetails: true,
          service:true
        }
      }
    }).then((result: any) => {
      return result;
    }).catch((error: any) => {
      this.exceptions.sendException(error);
    });
  }

  create(payment: CreatePaymentDto): Promise<PaymentDto> {
    return this.paymentRepository.save(payment);
  }

  async delete(id: number): Promise<void> {
    await this.paymentRepository.delete(id);
  }

  async update(paymentId: number, entity: UpdatePaymentDto): Promise<PaymentDto | null> {
    await this.paymentRepository.update(paymentId, entity);
    return this.paymentRepository.findOneBy({ paymentId });
  }
}