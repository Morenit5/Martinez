import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
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

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 50 })
  userType: string;

  @OneToOne(() => EntityRol, rol => rol.rolId)
  rol: EntityRol;

  @Column({ unique: true }) //para que el correo no se repita en la bd
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}