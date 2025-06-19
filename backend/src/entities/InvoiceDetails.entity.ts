import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityInvoiceDetails {
    @PrimaryGeneratedColumn()
    invoiceDetailId: number;

    @Column()
    invoiceId: number;

    @Column()
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
}