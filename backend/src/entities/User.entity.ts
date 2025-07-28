import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { EntityRol } from './Rol.entity';

@Entity()
export class EntityUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @ManyToOne(() => EntityRol, (rol) => rol.user, { onUpdate: "CASCADE" })
  @JoinColumn({name:'rolId' })
  rol: EntityRol;

  @Column({ unique: true }) //para que el correo no se repita en la bd
  email: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
  
}
 