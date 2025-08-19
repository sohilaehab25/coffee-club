import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/coffee-club'),
    CategoryModule,
    ItemModule,
    OrdersModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {

}
