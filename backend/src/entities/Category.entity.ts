import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityTool } from './Tool.entity';

@Entity()
export class EntityCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true }) 
  categoryType: string;

  @Column({ unique:true, type: 'varchar', length: 80 })
  name: string;

  @OneToMany(() => EntityTool, (tool) => tool.category)
  tool: EntityTool[];

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}