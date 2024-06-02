import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title!: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price!: number;

  @ManyToOne(type => Category, category => category.products)
  category: Category;

  @ManyToOne(type => OrderEntity, order => order.products)
  order: OrderEntity;
}
