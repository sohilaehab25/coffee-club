import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('menu/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        return this.categoryService.findAll(Number(page), Number(limit));
    }

    @Get('search')
    async search(
        @Query('name') name: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        return this.categoryService.searchByName(name, Number(page), Number(limit));
    }

}
