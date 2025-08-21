import { IsEmail } from 'class-validator';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModle: Model<User>
    ){}

    async findByEmail(email: string): Promise<User | null> {
        return this.userModle.findOne({ email }).exec();
    }

    async createUser(body: { email: string; password: string; role?: string ; name?: string }) {
        const { email, password, role, name } = body;

        // check if email already exists
        const existingUser = await this.userModle.findOne({ email });
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        // hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModle({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await newUser.save();

        return {
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        };
    }


    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
