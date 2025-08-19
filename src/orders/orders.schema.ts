import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Item } from '../item/item.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'pending',
    PREPARING = 'preparing',
    DELIVERED = 'delivered',
}

export enum PaymentMethod {
    CASH = 'cash',
    VISA = 'visa',
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: Item.name }], required: true })
    items: string[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ 
        type: String, 
        enum: Object.values(OrderStatus), 
        default: OrderStatus.PENDING 
    })
    status: OrderStatus;

    @Prop({ 
        type: String, 
        enum: Object.values(PaymentMethod), 
        default: PaymentMethod.CASH 
    })
    paymentMethod: PaymentMethod;

    @Prop({ required: true })
    address: String;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
