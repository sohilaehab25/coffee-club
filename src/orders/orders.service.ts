import { OrdersModule } from './orders.module';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}
  async create(createOrderDto: CreateOrderDto) {
   try {
            const order = await this.orderModel.create(createOrderDto);
            return {
                message: 'order created succefully',
                data: order,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to create category: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
