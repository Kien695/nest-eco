import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';

export function isUniqueContraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export function isUniqueNotFoundError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}

export const generateOTP = (): string => {
  return randomInt(100000, 1000000).toString();
};
