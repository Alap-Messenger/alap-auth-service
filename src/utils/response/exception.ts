/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLError } from 'graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new Logger('Error Logger');
    const contextType = host.getType<GqlContextType>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.response?.message || exception.message;
    let responseObjArr: unknown[];

    if (typeof message === 'object') {
      responseObjArr = [...message];
    } else {
      responseObjArr = [message];
    }

    logger.error(message, exception.stack);

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      return response.status(status).send({
        success: false,
        message: responseObjArr,
        data: null,
      });
    }

    // Handle GraphQL errors
    throw new GraphQLError(responseObjArr[0] as string, {
      extensions: {
        code: status,
        success: false,
        message: responseObjArr,
      },
    });
  }
}

export class Response<T> {
  @ApiProperty()
  success: boolean;
  data: T;
}

@Injectable()
export class GlobalResponseTransformer<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const contextType = context.getType<GqlContextType>();

    return next.handle().pipe(
      map((data) => {
        if (contextType === 'graphql') {
          return data;
        }
        return { success: true, data, message: null };
      }),
    );
  }
}
