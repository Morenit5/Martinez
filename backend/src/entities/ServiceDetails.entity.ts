import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityService } from './Service.entity';

@Entity()
export class EntityServiceDetail {
    @PrimaryGeneratedColumn()
    serviceDetailsId: number;

    @ManyToOne(() => EntityService, service => service.serviceId)
    @JoinColumn({ name: "serviceId" }) // Nombre de la columna en la tabla donde se une
    category: EntityService;

    @Column()
    serviceType: string;

    @Column()
    description: string;

    @Column()
    unitMeasurement: number;

    @Column()
    quantity: string;

    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

}