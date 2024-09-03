import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import config from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization;

		if (!token) throw new HttpException('User not authenticated!', 403);
		try {
			const key = fs.readFileSync(config.jwtPublicKeyPath, 'utf8');
			const mainToken = token.split(' ').pop();

			const decoded = jwt.verify(mainToken, key, { algorithms: ['HS256', 'RS256'] });
			request.user = decoded;

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
