import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const PrismaDecimal = Prisma.Decimal;

export { prisma, PrismaDecimal };
