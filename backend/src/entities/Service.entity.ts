import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityClient } from './Client.entity';
import { EntityServiceDetail } from './ServiceDetails.entity';
import { EntityInvoice } from './Invoice.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityService {
    @PrimaryGeneratedColumn()
    serviceId: number;

    @Column({ type: 'varchar', length: 150 })
    @IsNotEmpty({ message: 'El nombre del servicio es obligatorio.' })
    serviceName: string;

    @Column()
    serviceDate: Date;

    @OneToOne(() => EntityInvoice, invoice => invoice.invoiceId)
    invoice: EntityInvoice;

    @Column({ type: 'varchar', length: 60 })
    @IsNotEmpty({ message: 'El estatus del servicio es obligatorio.' })
    status: string;

    @Column({ type: 'varchar', length: 10 })
    @IsNotEmpty({ message: 'El precio del servicio es obligatorio.' })
    price: string;

    @ManyToOne(() => EntityClient, client => client.clientId)
    @JoinColumn({ name: "clientId" }) // Nombre de la columna en la tabla donde se une
    client: EntityClient;

    @OneToMany(() => EntityServiceDetail, servicedetail => servicedetail.serviceDetailsId)
    servicedetail: EntityServiceDetail[];

    @Column({ type: 'boolean', default: true })
    @IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })
    enabled: boolean;
  
}