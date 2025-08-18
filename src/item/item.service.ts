import { ItemModule } from './item.module';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemService {
    constructor(
        @InjectModel(Item.name)
        private readonly ItemModule: Model<Item>
    ) {}

    async create(createItemDto: CreateItemDto) {
        try {
            const item = await this.ItemModule.create(createItemDto);
            return {
                message: 'Item created succefully',
                data: item,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to create category: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            // Get paginated items
            const [items, total] = await Promise.all([
            this.ItemModule.find()
                .populate('categoryId')
                .skip(skip)
                .limit(limit)
                .exec(),
                this.ItemModule.countDocuments().exec(),
            ]);

            if (items.length === 0) {
                return {
                    message: "There are no items",
                    items: [],
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                };
            }

            return {
                message: "All items returned successfully",
                items,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw new Error(`Error fetching items: ${error.message}`);
        }
    }


    async findOne(_id: string) {
        return await this.ItemModule.findById(_id).populate('categoryId').exec();
    }

    async update(id: string , updateItemDto: UpdateItemDto) {
        return {
            data: await this.ItemModule.findByIdAndUpdate(id, updateItemDto, { new: true }),
            message: "item updated succefully"
        }
    }

    async remove(id: string) {
        await this.ItemModule.findByIdAndDelete(id)
        return {
            message: "item deleted"
        }
    }

    async searchItem(
        search?: string,
        categoryName?: string,
        minPrice?: number,
        maxPrice?: number,
        page: number = 1,
        limit: number = 10
    ) {
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        const skip = (page - 1) * limit;

        const pipeline: any[] = [];

        // --- text search on name + description ---
        if (search) {
            pipeline.push({
                $match: {
                    $text: { $search: search }
                }
            });
        }

        // --- price filter ---
        if (minPrice != null || maxPrice != null) {
            const priceFilter: any = {};
            if (minPrice != null) priceFilter.$gte = minPrice;
            if (maxPrice != null) priceFilter.$lte = maxPrice;

            pipeline.push({
                $match: { price: priceFilter }
            });
        }

        // --- join category + filter by name ---
        if (categoryName) {
            pipeline.push({
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            });

            pipeline.push({ $unwind: '$category' }); 
            pipeline.push({
                $match: {
                    'category.categoryName': { $regex: categoryName, $options: 'i' }
                }
            });
        }

        pipeline.push({ $skip: skip }, { $limit: limit });

        return this.ItemModule.aggregate(pipeline);
    }

}
