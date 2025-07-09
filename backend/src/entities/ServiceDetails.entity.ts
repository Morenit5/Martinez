import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityService } from './Service.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityServiceDetail {
    @PrimaryGeneratedColumn()
    serviceDetailsId: number;

    @ManyToOne(() => EntityService, service => service.serviceId, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "serviceId" }) // Nombre de la columna en la tabla donde se une
    category: EntityService;

    @Column({ type: 'varchar', length: 150 })
    @IsNotEmpty({ message: 'El tipo del servicio es obligatorio.' })
    serviceType: string;

    @Column({ type: 'varchar', length: 400 })
    @IsNotEmpty({ message: 'La descripcion del servicio es obligatorio.' })
    description: string;

    @Column() // unidad de medida litros, metros, piezas
    @IsNotEmpty({ message: 'La unidad de medida del servicio es requerida.' })
    unitMeasurement: number;

    @Column() // la cantidad que se uso de cada servicio
    @IsNotEmpty({ message: 'La cantidad es requerida.' })
    quantity: number;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;
}