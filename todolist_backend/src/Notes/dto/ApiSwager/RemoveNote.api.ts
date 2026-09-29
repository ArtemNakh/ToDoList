import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRemoveNote() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({ summary: 'Delete note by ID for current user' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The note has been successfully deleted.',
    }),
    ApiNotFoundResponse({
      description: 'Note with specified ID for current user was not found.',
      schema: {
        example: {
          message: 'Note not found',
          error: 'Not Found',
          statusCode: 401,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated.',
      schema: {
        example: {
          message: 'Authorization error',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
