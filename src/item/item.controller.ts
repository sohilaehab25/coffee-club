import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // standard guard using PassportStrategy
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('menu/item')
export class ItemController {
	constructor(private readonly itemService: ItemService) {}

	@Roles('admin')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	create(@Body() createItemDto: CreateItemDto) {
		return this.itemService.create(createItemDto);
	}

	@Get()
	async findAll() {
		return await this.itemService.findAll();
	}
	
	@Get('search')
	async search(
		@Query('search') search: string,
		@Query('categoryName') categoryName?: string,
		@Query('page') page: string = '1',
		@Query('limit') limit: string = '10'
	) {
		return this.itemService.searchItem(
			search,
			categoryName,
			Number(page),
			Number(limit),
		);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.itemService.findOne(id);
	}

	@Roles('admin')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
		return await this.itemService.update(id, updateItemDto);
	}

	@Roles('admin')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.itemService.remove(id);
	}

}
