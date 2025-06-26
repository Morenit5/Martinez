import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EntityClient } from './Client.entity';
import { EntityServiceDetail } from './ServiceDetails.entity';

@Entity()
export class EntityService {
    @PrimaryGeneratedColumn()
    serviceId: number;

    @Column()
    serviceName: string;

    @Column()
    serviceDate: Date;

    /*@Column()
    clientId: number;*/

    @Column()
    invoiceId: number;

    @Column()
    status: string;

    @Column()
    price: string;

    @ManyToOne(() => EntityClient, client => client.clientId)
    @JoinColumn({ name: "clientId" }) // Nombre de la columna en la tabla donde se une
    client: EntityClient;

    @OneToMany(() => EntityServiceDetail, servicedetail => servicedetail.serviceDetailsId)
    servicedetail: EntityServiceDetail[];
}