import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { EntityUser } from './User.entity';
import { EntityPermission } from './Permission.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class EntityRol {
    @PrimaryGeneratedColumn()
    rolId: number;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'El nombre del rol es obligatorio.' })
    name: string;

    @OneToOne(() => EntityUser, user => user.userId)
    user: EntityUser;

    @OneToMany(() => EntityPermission, permission => permission.permissionId)
    permission: EntityPermission[];

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}