import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityInvoice } from './Invoice.entity';


@Entity()
export class EntityInvoiceDetails {
    @PrimaryGeneratedColumn()
    invoiceDetailId: number;

    @ManyToOne(() => EntityInvoice, (invoice) => invoice.invoiceDetails, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "invoiceId" }) // Nombre de la columna en la tabla donde se une
    invoice: EntityInvoice;

    @Column({ type: 'varchar', length: 300 })
    concept: string;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column()
    quantity: number;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    subtotal: number;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}