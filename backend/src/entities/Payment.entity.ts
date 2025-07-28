import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityInvoice } from './Invoice.entity';


@Entity()
export class EntityPayment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column('numeric', { precision: 7, scale: 2, transformer: new ColumnNumericTransformer()})
  paymentAmount: number;

  @Column({ type: 'varchar', length: 30 })
  paymentMethod: string;

  @ManyToOne(() => EntityInvoice, (invoice) => invoice.payment, { onUpdate: "CASCADE" })
  @JoinColumn({ name: "invoiceId" }) // Nombre de la columna en la tabla donde se une
  invoice: EntityInvoice;

  @Column('numeric', { precision: 7, scale: 2, transformer: new ColumnNumericTransformer()})
  taxAmount: number;

  @Column({ type: 'varchar', length: 40 })
  paymentStatus: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}

