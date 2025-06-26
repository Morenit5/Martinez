import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityService } from './Service.entity';

@Entity()
export class EntityClient {
    @PrimaryGeneratedColumn()
    clientId: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    address: string;

    @Column()
    phone: number;

    @Column()
    email: string;

    @Column()
    clientType: string;

    @Column()
    registryDate: Date;

    @OneToMany(() => EntityService, service => service.serviceId)
    service: EntityClient[];
}