import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityConfiguration {
    @PrimaryGeneratedColumn()
    configurationId: number;

    @Column({ unique: true, nullable: true }) //para que el correo no se repita en la bd
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    password: string;

    @Column({ type: 'boolean', default: false ,nullable: true})
    isInvoiceAutomatically: boolean;

    @Column({type:'varchar', length:15, unique: true, nullable: true})
    licenseNumber: string;

    @Column({ type: 'boolean', default: false, nullable: true})
    enableNotification: boolean;  //notificaciones para los clientes antes que se venza la factura
    
    @Column({type:'numeric', nullable: true})   
    enableOnDate: number; //en que dia se mandara la notificacion para los clientes antes que se venza la factura

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}