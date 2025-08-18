import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemDocument } from './item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemDocument }])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
