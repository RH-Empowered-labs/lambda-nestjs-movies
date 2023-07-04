import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerValue = req.headers['x-custom-header'];
    
    if (!headerValue || headerValue !== 'valor esperado') {
      throw new HttpException('Invalid header', HttpStatus.BAD_REQUEST);
    }

    next();
  }
}