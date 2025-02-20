import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Catch(EntityNotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const message = exception.message;

    const { target, method } = exception.context;
    const contextDescriptor = `${target.constructor.name}::${method}`;
    Logger.error(
      message,
      exception.stack,
      `${request.method} ${request.url} -> ${contextDescriptor}`,
    );

    response
      .status(HttpStatus.BAD_REQUEST)
      .json({ status: HttpStatus.BAD_REQUEST, message, request });
  }
}
