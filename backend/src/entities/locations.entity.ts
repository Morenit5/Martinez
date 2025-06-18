import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class locations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  photo: string;

  @Column()
  availableUnits:string;

  @Column()
  wifi:boolean;

  @Column()
  laundry: boolean;
}