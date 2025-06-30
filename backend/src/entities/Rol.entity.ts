import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { EntityUser } from './User.entity';
import { EntityPermission } from './Permission.entity';

@Entity()
export class EntityRol {
    @PrimaryGeneratedColumn()
    rolId: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @OneToOne(() => EntityUser, user => user.userId)
    user: EntityUser;

    @OneToMany(() => EntityPermission, permission => permission.permissionId)
    permission: EntityPermission[];

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}