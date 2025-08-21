import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' here must match the name in your strategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
