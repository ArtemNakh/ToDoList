import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Декоратор для витягування даних користувача з Express Session.
 * 
 * Decorator to retrieve user session
 * 
 * @example
 * // Get specific field (id)
 * saveNote(@GetUserFromSession() userId: number)
 */
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userSession = request.session?.userId;

    if (!userSession) {
      throw new UnauthorizedException('Unauthorized user');
    }

    // if a specific field is provided (example 'id') return only that field ,otherwise return full object
    return data ? userSession[data] : userSession;
  },
);
