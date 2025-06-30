import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityRol } from './Rol.entity';

@Entity()
export class EntityPermission {
    @PrimaryGeneratedColumn()
    permissionId: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @ManyToOne(() => EntityRol, rol => rol.rolId)
    @JoinColumn({ name: "rolId" }) // Nombre de la columna en la tabla donde se une
    rol: EntityRol;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}