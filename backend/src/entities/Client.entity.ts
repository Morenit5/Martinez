import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityService } from './Service.entity';

@Entity()
export class EntityClient {
    @PrimaryGeneratedColumn()
    clientId: number;

    @Column({ type: 'varchar', length: 60 })
    name: string;

    @Column({ type: 'varchar', length: 60 })
    lastName: string;

    @Column({ type: 'varchar', length: 100 })
    address: string;

    @Column()
    phone: number;

    @Column({ unique: true }) //para que el correo no se repita en la bd
    email: string;

    @Column({ type: 'varchar', length: 30 })
    clientType: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    registryDate: Date;

    @OneToMany(() => EntityService, service => service.client)
    service: EntityService[];

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}