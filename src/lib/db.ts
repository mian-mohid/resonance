import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const db = globalForPrisma.prisma || new PrismaClient({ adapter });

export { db };
