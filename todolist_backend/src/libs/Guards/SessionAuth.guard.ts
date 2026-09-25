import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
/**
 * Guard for check active user session
 * 
 * if the user is not authorized, request s blocked with an Http 401 error
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {
    /**
   * Evaluates authentication state for the current request context.
   *
   * @param context - The current execution context providing access to HTTP request details.
   * @returns {boolean} `true` if the session contains a valid `userId`.
   *
   * @throws {UnauthorizedException} Thrown when no valid session or `userId` is present.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    //Check user session
    const session = request.session;
    const isAuthorized: boolean = Boolean(session.userId);
    if (!isAuthorized) {
      throw new UnauthorizedException('Authorization error');
    }
    return true;
  }
}
