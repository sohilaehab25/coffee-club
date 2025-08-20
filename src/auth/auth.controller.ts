import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    @Post('signup')
    async signUp(@Body() body: { name: string; email: string; password: string; role?: string }) {
        const user = await this.userService.createUser(body);
        return user
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const token = await this.authService.login(user);
        return {
            message: 'Login successful',
            user,
            token,
        };
    }
}
