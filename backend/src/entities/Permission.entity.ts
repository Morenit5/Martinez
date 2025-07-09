import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityRol } from './Rol.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class EntityPermission {
    @PrimaryGeneratedColumn()
    permissionId: number;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'El nombre del permiso es obligatorio.' })
    name: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @ManyToOne(() => EntityRol, rol => rol.rolId, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "rolId" }) // Nombre de la columna en la tabla donde se une
    rol: EntityRol;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}