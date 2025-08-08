import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<Category>
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoryModel.create(createCategoryDto);
            return {
                message: 'Category created',
                data: category,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to create category: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [categories, total] = await Promise.all([
            this.categoryModel.find().skip(skip).limit(limit).exec(),
            this.categoryModel.countDocuments()
        ]);

        return {
            data: categories,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async update(id: string, updateCategoryDto: Partial<Category>): Promise<Category | null> {
        try {
            return await this.categoryModel
                .findByIdAndUpdate(id, updateCategoryDto, { new: true })
                .exec();
        } catch (error) {
            throw new HttpException(
                `Failed to update category: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async remove(id: string) {
        try {
            await this.categoryModel.findByIdAndDelete(id);
            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw new HttpException(
                `Failed to delete category: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async searchByName(name: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const query = { name: { $regex: name, $options: 'i' } };

        const [categories, total] = await Promise.all([
            this.categoryModel.find(query).skip(skip).limit(limit).exec(),
            this.categoryModel.countDocuments(query)
        ]);

        return {
            data: categories,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
