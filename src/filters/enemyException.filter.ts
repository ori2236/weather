import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { EnemyException } from '../exceptions/enemy.exception';

@Catch(EnemyException)
export class EnemyExceptionFilter implements ExceptionFilter {
  catch(exception: EnemyException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
