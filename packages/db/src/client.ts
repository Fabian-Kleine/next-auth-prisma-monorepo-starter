import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  if (process.env.USE_ACCELERATE === "false") {
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 40 }),
    }).$extends(withAccelerate());
  }

  return new PrismaClient({
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL ?? process.env.DATABASE_URL!,
  }).$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma: PrismaClientSingleton = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
