import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityInvoice } from './Invoice.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityInvoiceDetails {
    @PrimaryGeneratedColumn()
    invoiceDetailId: number;

    @ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "invoiceId" }) // Nombre de la columna en la tabla donde se une
    category: EntityInvoice;

    @Column({ type: 'varchar', length: 300 })
    @IsNotEmpty({ message: 'Escribe la información de los conceptos*.' })
    concept: string;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column()
    @IsNotEmpty({ message: 'El campo cantidad es obligatorio.' })
    quantity: number;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    subtotal: number;

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;
}