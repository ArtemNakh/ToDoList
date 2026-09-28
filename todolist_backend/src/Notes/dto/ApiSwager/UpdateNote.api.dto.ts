import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NoteResponseDto } from '../Response/Note.response.dto.js';

export function ApiUpdateNote() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Update note values',
      description:
        'Update title or content values into note for currently user',
    }),
    ApiResponse({
      status: 200,
      description: 'Note was successfully updated into database',
      type: NoteResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Invalid updated data (user(id) doesn`t have note(id) ',
      schema: {
        example: {
          message: 'Note data is invalid',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated or the session is invalid',
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
