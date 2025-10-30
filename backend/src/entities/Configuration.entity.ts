import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityConfiguration {
    @PrimaryGeneratedColumn()
    configurationId: number;

    @Column({ unique: true }) //para que el correo no se repita en la bd
    email: string;

    @Column({ type: 'varchar', length: 50 })
    password: string;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}