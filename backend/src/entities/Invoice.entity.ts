import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityInvoiceDetails } from './InvoiceDetails.entity';
import { EntityPayment } from './Payment.entity';

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

    @OneToMany(() => EntityPayment, payment => payment.paymentId)
    payment: EntityPayment[];

    @OneToMany(() => EntityInvoiceDetails, invoiceDetail => invoiceDetail.invoiceId)
    invoiceDetail: EntityInvoiceDetails[];

}