import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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


  @ManyToOne(() => EntityPayment, payment => payment.invoiceId)
      @JoinColumn({ name: "invoiceId" }) // Nombre de la columna en la tabla donde se une
      payment: EntityPayment;

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

