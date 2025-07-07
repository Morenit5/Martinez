import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityTool } from './Tool.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ type: 'varchar', length: 50 }) 
  @IsNotEmpty({ message: 'El tipo de la categoría es obligatorio.' })
  categoryType: string;

  @Column({ type: 'varchar', length: 80 })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
  name: string;

  @OneToMany(() => EntityTool, tool => tool.categoryId)
  tool: EntityTool[];

  @Column({ type: 'boolean', default: true })
  /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
  enabled: boolean;
}