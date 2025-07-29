import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityCategory } from './Category.entity';

@Entity()
export class EntityTool {
    @PrimaryGeneratedColumn()
    toolId: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 60 })
    code: string;

    @Column({ type: 'varchar', length: 150, nullable: true  })
    image?: string;

    //@Column() //manyToOne
    //categoryId: number;

    @ManyToOne(() => EntityCategory, (category) => category.tool, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "categoryId" }) // Nombre de la columna en la tabla Category donde se une
    category: EntityCategory;

    @Column({ type: 'varchar', length: 100 })
    status: string; //activo, inactivo

    @Column({ type: 'varchar', length: 100 })
    toolState: string; //bueno, malo, mantenimiento

    @Column({ nullable: true })
    prize?: number;

    @Column({ type: 'date', nullable: true })
    acquisitionDate?: Date;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}