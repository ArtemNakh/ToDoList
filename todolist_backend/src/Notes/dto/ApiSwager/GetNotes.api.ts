import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NoteResponseDto } from '../Response/Note.response.dto.js';

export function ApiGetNotes() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Get user notes',
      description: 'Return all notes that user have ',
    }),
    ApiResponse({
      status: 200,
      description: 'List of notes that user had',
      type: NoteResponseDto,
      isArray: true,
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
