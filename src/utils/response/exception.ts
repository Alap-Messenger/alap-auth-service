/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const logger = new Logger('Error Logger');
		const ctx = host.switchToHttp();
		const request = ctx.getResponse();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const message = exception?.response?.message || exception.message;
		let responseObjArr: unknown[];

		logger.error(exception.message, exception.stack, ctx.getRequest().url);

		if (typeof message === 'object') {
			responseObjArr = [...message];
		} else {
			responseObjArr = [message];
		}

		request.status(status).send({
			success: false,
			message: responseObjArr,
			data: null,
		});
	}
}

export class Response<T> {
	@ApiProperty()
	success: boolean;
	data: T;
}

@Injectable()
export class GlobalResponseTransformer<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		return next.handle().pipe(map((data) => ({ success: true, data, message: null })));
	}
}
