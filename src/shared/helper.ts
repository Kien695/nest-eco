import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
import path from 'path';
import { v4 as v4uuid } from 'uuid';
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

export function isForeignKeyConstrainPrismaError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2003'
  );
}

export const generateRandomFileName = (fileName: string) => {
  const ext = path.extname(fileName);
  return `${v4uuid()}${ext}`;
};
