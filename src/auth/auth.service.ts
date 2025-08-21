import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    // Validate user credentials
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        // return user without password
        const { password: _, ...result } = user;
        return result;
    }

    // Login (return JWT token)
    async login(user: any) {

        const payload = { sub: user._doc._id.toString(), email: user._doc.email, role: user._doc.role };

        // uses the expiresIn you set in JwtModule
        const access_token = await this.jwtService.signAsync(payload);

        // optional: include expiry info in the response
        const decoded = this.jwtService.decode(access_token) as { exp?: number } | null;

        return {
            access_token,
            tokenType: 'Bearer',
            expiresIn: this.config.get('JWT_EXPIRES_IN') || '3h',
            expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : undefined,
        };
    }
}
