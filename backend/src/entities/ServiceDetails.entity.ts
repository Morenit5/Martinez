import { ColumnNumericTransformer } from 'src/utils/ColumnNumericTransformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityServiceDetail {
    @PrimaryGeneratedColumn()
    serviceDetailsId: number;

    @Column()
    serviceId: number;

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