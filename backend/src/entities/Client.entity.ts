import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityService } from './Service.entity';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class EntityClient {
    @PrimaryGeneratedColumn()
    clientId: number;

    @Column({ type: 'varchar', length: 60 })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @Column({ type: 'varchar', length: 60 })
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    lastName: string;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty({ message: 'Favor de escribir la Dirección es un campo obligatorio.' })
    address: string;

    @Column()
    @IsNotEmpty({ message: 'Favor de escribir el Número Telefónico es un campo obligatorio.' })
    phone: number;

    @Column({ unique: true }) //para que el correo no se repita en la bd
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Column({ type: 'varchar', length: 30 })
    clientType: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    registryDate: Date;

    /*@IsDate({ message: 'Invalid date format' })
    @Type(() => Date)
    public readonly dateOfBirth: Date;*/

    @OneToMany(() => EntityService, service => service.serviceId)
    service: EntityClient[];

    @Column({ type: 'boolean', default: true })
    /*@IsBoolean({ message: 'El campo "activo" debe ser verdadero o falso' })*/
    enabled: boolean;
}