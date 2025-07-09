import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityCategory } from './Category.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityTool {
    @PrimaryGeneratedColumn()
    toolId: number;

    @Column({ type: 'varchar', length: 150 })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @Column({ type: 'varchar', length: 60 })
    @IsNotEmpty({ message: 'El código es obligatorio.' })
    code: string;

    @Column({ type: 'varchar', length: 150 })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    image: string;

    @Column() //manyToOne
    categoryId: number;

    @ManyToOne(() => EntityCategory, category => category.categoryId, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "categoryId" }) // Nombre de la columna en la tabla Category donde se une
    category: EntityCategory;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'El estatus es obligatorio.' })
    status: string;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'El estatus de la herramienta es obligatorio.' })
    toolState: string;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'El proveedor es campo requerido.' })
    provider: string;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'La fecha de adquisición es obligatoria.' })
    acquisitionDate: Date;

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;
}