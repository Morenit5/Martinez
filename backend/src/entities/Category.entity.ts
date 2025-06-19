import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityTool } from './Tool.entity';

@Entity()
export class EntityCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  categoryType: string;

  @Column()
  name: string;

  @OneToMany(() => EntityTool, tool => tool.categoryId)
  tool: EntityTool[];

}