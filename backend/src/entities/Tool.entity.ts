import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityCategory } from './Category.entity';

@Entity()
export class EntityTool {
    @PrimaryGeneratedColumn()
    toolId: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    image: string;

    @Column() //manyToOne
    categoryId: number;

    @ManyToOne(() => EntityCategory, category => category.categoryId)
    @JoinColumn({ name: "categoryId" }) // Nombre de la columna en la tabla Category donde se une
    category: EntityCategory;

    @Column()
    status: string;

    @Column()
    toolState: string;

    @Column()
    provider: string;

    @Column()
    acquisitionDate: Date;

    @Column()
    enabled: boolean;
}