
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(private jwtService: JwtService) {
        super();
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        //console.log('fue llamado')

        const request = context.switchToHttp().getRequest();
        //console.log(request)
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        //console.log('El token extraido ' + JSON.stringify(token))
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            // We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch (e) {
            throw new UnauthorizedException('refresh token expired');
        }

        //console.log('retornamos true')
        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
