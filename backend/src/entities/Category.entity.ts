import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityTool } from './Tool.entity';

@Entity()
export class EntityCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ type: 'varchar', length: 50 })
  categoryType: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @OneToMany(() => EntityTool, tool => tool.categoryId)
  tool: EntityTool[];

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}