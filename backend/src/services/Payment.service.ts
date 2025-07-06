import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EntityPayment } from '../entities/Payment.entity';

@Injectable()
export class ServicePayment {
  constructor(@InjectRepository(EntityPayment) private paymentRepository: Repository<EntityPayment>) {

  }

  findAll(): Promise<EntityPayment[]> {
    return this.paymentRepository.find();
  }

  findOne(paymentId: number): Promise<EntityPayment | null> {
    return this.paymentRepository.findOneBy({ paymentId });
  }

  create(payment: EntityPayment): Promise<EntityPayment> {
    return this.paymentRepository.save(payment);
  }

  async delete(id: number): Promise<void> {
    await this.paymentRepository.delete(id);
  }

  async update(id: string, entity: EntityPayment): Promise<UpdateResult> {
    return await this.paymentRepository.update(id, entity);
  }
}