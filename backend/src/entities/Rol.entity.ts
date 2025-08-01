import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { EntityUser } from './User.entity';
import { EntityPermission } from './Permission.entity';


@Entity()
export class EntityRol {
    @PrimaryGeneratedColumn()
    rolId: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @OneToMany(() => EntityUser, (user) => user.rol)
    user: EntityUser;

    @ManyToMany(() => EntityPermission, (permission) => permission.rol)
    @JoinTable({name:'RolPermission' }) 
    permission: EntityPermission[];

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}