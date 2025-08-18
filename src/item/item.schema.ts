import { Category } from './../category/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    imageUrl: string;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    categoryId: string;
}

export const ItemDocument = SchemaFactory.createForClass(Item);

ItemDocument.index({ name: 'text', description: 'text' }); // for text search
ItemDocument.index({ price: 1 });                          // for numeric search
ItemDocument.index({ categoryId: 1 });                     // for category filtering
