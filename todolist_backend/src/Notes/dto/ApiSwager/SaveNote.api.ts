import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { NoteResponseDto } from '../Response/Note.response.dto.js';

export function ApiSaveNote() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Create or save a note',
      description:
        'Creates a new note for the currently authenticated user',
    }),
    ApiResponse({
      status: 201,
      description: 'Note successfully created and saved to the database',
      type: NoteResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data provided (e.g., empty title)',
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