import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityService {
    @PrimaryGeneratedColumn()
    serviceId: number;

    @Column()
    serviceName: string;

    @Column()
    serviceDate: Date;

    @Column()
    clientId: number;

    @Column()
    invoiceId: number;

    @Column()
    status: string;

    @Column()
    price: string;

}