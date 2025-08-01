import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { EntityRol } from './Rol.entity';


@Entity()
export class EntityPermission {
    @PrimaryGeneratedColumn()
    permissionId: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => EntityRol, (rol) => rol.permission, { onUpdate: "CASCADE" })
    rol: EntityRol[];

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}