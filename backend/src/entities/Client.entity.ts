import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}