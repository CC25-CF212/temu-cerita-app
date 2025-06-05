// lib/db-error-handler.ts
import { MongoError } from 'mongodb';

export interface DatabaseError {
  success: false;
  error: string;
  code?: string | number;
  statusCode: number;
}

export function handleDatabaseError(error: any): DatabaseError {
  console.error('Database error:', error);

  // MongoDB specific errors
  if (error instanceof MongoError) {
    switch (error.code) {
      case 11000: // Duplicate key error
        return {
          success: false,
          error: 'Duplicate entry found',
          code: error.code,
          statusCode: 409
        };
      case 121: // Document validation failure
        return {
          success: false,
          error: 'Invalid data format',
          code: error.code,
          statusCode: 400
        };
      default:
        return {
          success: false,
          error: 'Database operation failed',
          code: error.code,
          statusCode: 500
        };
    }
  }

  // Network/Connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
    return {
      success: false,
      error: 'Database connection failed',
      statusCode: 503
    };
  }

  // Timeout errors
  if (error.name === 'MongoTimeoutError') {
    return {
      success: false,
      error: 'Database operation timed out',
      statusCode: 408
    };
  }

  // Generic error
  return {
    success: false,
    error: error.message || 'Unknown database error',
    statusCode: 500
  };
}

// Wrapper function for database operations
export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T | DatabaseError> {
  try {
    return await operation();
  } catch (error) {
    return handleDatabaseError(error);
  }
}