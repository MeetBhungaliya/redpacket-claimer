import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const client = new PrismaClient().$extends({
    model: {
      product: {
        async delete({ where }) {
          return client.product.update({
            where: {
              ...where,
            },
            data: {
              deleted_at: new Date(),
            },
          });
        },
      },
    },
    query: {
      product: {
        async $allOperations({ operation, args, query }) {
          if (operation === "findUnique" || operation === "findMany") {
            args.where = { ...args.where, deleted_at: null };
          }
          return query(args);
        },
      },
    },
  });

  return client;
};

const globalForPrisma = globalThis;

globalForPrisma.prisma = globalForPrisma.prisma || prismaClientSingleton();

export const prisma = globalForPrisma.prisma;
