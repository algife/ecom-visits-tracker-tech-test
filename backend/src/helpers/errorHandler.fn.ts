import { Response } from 'express';

/**
 * Error handling middleware.
 *
 * @param statusCode - The HTTP status code to send.
 * @param msg - A message describing the error.
 * @param err - The error object.
 * @param valueOnError - The value to return in the response.
 * @param res - The response object.
 */
export default function errorHandler<T>(statusCode: number,
  msg: string,
  err: unknown,
  valueOnError: T,
  res: Response<unknown, Record<string, unknown>>) {
  console.error(err);
  res.status(statusCode).json(valueOnError);
} 