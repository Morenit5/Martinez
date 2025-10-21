import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,  ManyToOne, JoinColumn } from 'typeorm';
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

    @OneToMany(() => EntityPayment, payment => payment.invoice,{ cascade: true })
    payment: EntityPayment[];

    @ManyToOne(() => EntityService, (service) => service.invoice, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "serviceId" }) // Nombre de la columna en la tabla donde se une
    service?: EntityService;

    @Column('numeric', { precision: 7, scale: 2, transformer: new ColumnNumericTransformer() })
    subtotalAmount: number;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;

    @Column({ type: 'boolean',nullable:true, default: false })
    isGenerated: boolean;
}