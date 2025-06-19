import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityInvoice {
    @PrimaryGeneratedColumn()
    invoiceId: number;

    @Column()
    clientId: number;

    @Column()
    invoiceDate: Date;

    @Column()
    invoiceNumber: string;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    totalAmount: number;

    @Column()
    paymentId: number;

}