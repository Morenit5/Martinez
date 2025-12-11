import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { EntityRol } from './Rol.entity';

@Entity()
export class EntityUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 250, unique:true })
  username: string;

  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ type: 'varchar', nullable:true, length: 250 })
  firstname?: string;

  @Column({ type: 'varchar', nullable:true, length: 250 })
  lastname?: string;

  @ManyToOne(() => EntityRol, (rol) => rol.user, { onUpdate: "CASCADE" })
  @JoinColumn({name:'rolId' })
  rol: EntityRol;

  @Column({ unique: true }) //para que el correo no se repita en la bd
  email: string;

  @Column({ unique: true, nullable:true }) //para que el telefono sea unico y no se repita en la bd
  phone?: string;

  @Column({ type: 'varchar', nullable:true, default:'placeholder.png'}) 
  avatar: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'varchar', nullable:true,})
  refreshToken:string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registryDate: Date;
  
}
 