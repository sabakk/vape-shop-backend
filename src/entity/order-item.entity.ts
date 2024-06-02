import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity('order_items')
export class OrderItemEntity extends BaseEntity{
@PrimaryGeneratedColumn()
id: string;

@Column()
product_title: string;

@Column()
price: number;

@Column()
quantity: number;

@ManyToOne(() => OrderEntity, order => order.orderItems)
order: OrderEntity;
}