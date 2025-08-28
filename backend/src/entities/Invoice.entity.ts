import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { EntityInvoiceDetails } from './InvoiceDetails.entity';
import { EntityPayment } from './Payment.entity';
import { EntityService } from './Service.entity';


@Entity()
export class EntityInvoice {
    @PrimaryGeneratedColumn()
    invoiceId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    invoiceDate: Date;

    @Column({type: 'varchar', length: 40 })
    invoiceNumber: string;

    @Column({type: 'varchar', length: 150, nullable:true })
    invoiceName: string;

    @Column('numeric', { precision: 7, scale: 2, transformer: new ColumnNumericTransformer() })
    totalAmount: number;

    @OneToMany(() => EntityPayment, payment => payment.invoice)
    payment: EntityPayment[];

    @OneToMany(() => EntityInvoiceDetails, (invoiceDetail) => invoiceDetail.invoice)
    invoiceDetails: EntityInvoiceDetails[];

    @OneToOne(() => EntityService, (service) => service.invoice)
    service?: EntityService;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}