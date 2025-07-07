import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityInvoiceDetails } from './InvoiceDetails.entity';
import { EntityPayment } from './Payment.entity';
import { EntityService } from './Service.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityInvoice {
    @PrimaryGeneratedColumn()
    invoiceId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    invoiceDate: Date;

    @Column({type: 'varchar', length: 40 })
    @IsNotEmpty({ message: 'El número de factura es obligatorio.' })
    invoiceNumber: string;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    totalAmount: number;

    @OneToMany(() => EntityPayment, payment => payment.paymentId)
    payment: EntityPayment[];

    @OneToMany(() => EntityInvoiceDetails, invoiceDetail => invoiceDetail.invoiceDetailId)
    invoiceDetail: EntityInvoiceDetails[];

    @OneToOne(() => EntityService, service => service.serviceId)
    service: EntityService;

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;
}