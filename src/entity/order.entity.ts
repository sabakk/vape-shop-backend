import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";
import { OrderItemEntity } from "./order-item.entity";

export enum OrderStatusEnum {
    PENDING = 'pending',
    PAYED = 'payed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered'
  }

@Entity('orders')
export class OrderEntity extends BaseEntity{
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PENDING }) 
  status: OrderStatusEnum;

  @ManyToOne(type => User, user => user.orders)
  user: User;

  @OneToMany(type => Product, products => products.order, {cascade: true})
  products: Product[];

  @OneToMany(type => OrderItemEntity, order_items => order_items.order, {cascade: true})
  orderItems: OrderItemEntity[];
}