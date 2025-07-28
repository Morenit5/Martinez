import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityService } from './Service.entity';

@Entity()
export class EntityServiceDetail {
    @PrimaryGeneratedColumn()
    serviceDetailsId: number;

    @ManyToOne(() => EntityService, service => service.serviceDetail, { onUpdate: "CASCADE" })
    @JoinColumn({ name: "serviceId" }) // Nombre de la columna en la tabla donde se une
    service: EntityService;

    @Column({ type: 'varchar', length: 150 })
    serviceType: string;

    @Column({ type: 'varchar', length: 400 })
    description: string;

    @Column() // unidad de medida litros, metros, piezas
    unitMeasurement: number;

    @Column() // la cantidad que se uso de cada servicio
    quantity: number;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;
}