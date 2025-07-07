import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityInvoice } from './Invoice.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityPayment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  paymentAmount: number;

  @Column({ type: 'varchar', length: 30 })
  @IsNotEmpty({ message: 'El método de pago es obligatorio.' })
  paymentMethod: string;

  @ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoiceId" }) // Nombre de la columna en la tabla donde se une
  invoice: EntityInvoice;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  taxAmount: number;

  @Column({ type: 'varchar', length: 40 })
  @IsNotEmpty({ message: 'El estatus del pago es obligatorio.' })
  paymentStatus: string;

  @Column({ type: 'boolean', default: true })
  /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
  enabled: boolean;
}

