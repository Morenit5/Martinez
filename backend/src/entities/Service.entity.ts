import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityClient } from './Client.entity';
import { EntityServiceDetail } from './ServiceDetails.entity';
import { EntityInvoice } from './Invoice.entity';


@Entity()
export class EntityService {
    @PrimaryGeneratedColumn()
    serviceId: number;

    @Column({ type: 'varchar', length: 150 })
    serviceName: string;

    @Column()
    serviceDate: Date;

    @OneToOne(() => EntityInvoice, invoice => invoice.service,{ cascade: true })
    @JoinColumn({ name: "invoiceId" })
    invoice?: EntityInvoice;

    @Column({ type: 'varchar', length: 60 })
    status: string;

    @Column({ type: 'varchar', length: 10 })
    price: string;

    @ManyToOne(() => EntityClient, client => client.service, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "clientId" }) // Nombre de la columna en la tabla donde se une
    client: EntityClient;

    @OneToMany(() => EntityServiceDetail, (servicedetail) => servicedetail.service, { cascade: true  })
    serviceDetail: EntityServiceDetail[];

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;

    @Column({ type: 'boolean', default: false })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    isExtra: boolean;
  
}