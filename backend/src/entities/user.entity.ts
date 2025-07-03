import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { EntityRol } from './Rol.entity';

@Entity()
export class EntityUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'La contraseña es obligatorio.' })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio.' })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastname: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'El estatus del usuario es obligatorio.' })
  status: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'El tipo de usuario es requerido.' })
  userType: string;

  @OneToOne(() => EntityRol, rol => rol.rolId)
  rol: EntityRol;

  @Column({ unique: true }) //para que el correo no se repita en la bd
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })
  enabled: boolean;
}