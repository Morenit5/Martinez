import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityPayment } from '../entities/Payment.entity';

@Injectable()
export class ServicePayment {
  constructor(@InjectRepository(EntityPayment) private paymentRepository: Repository<EntityPayment>) {
    
  }

  findAll(): Promise<EntityPayment[]> {
    return this.paymentRepository.find();
  }

  findOne(paymentId: number): Promise<EntityPayment|null> {
    return this.paymentRepository.findOneBy({ paymentId });
  }

  create(payment: EntityPayment): Promise<EntityPayment> {
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}