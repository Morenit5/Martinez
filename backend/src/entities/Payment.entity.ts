import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityPayment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  paymentDate: Date;

@Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
   paymentAmount: number;

  @Column()
  paymentMethod: string;

  @Column()
  invoiceId: number;

@Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  taxAmount: number;

  @Column()
  paymentStatus: string;
}

