import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export type DbClient = PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

function getAdapter() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!global.__pgPool) {
    global.__pgPool = new Pool({ connectionString });
  }

  return new PrismaPg(global.__pgPool);
}

export function getDb(): DbClient {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ adapter: getAdapter() });
  }

  return global.__prisma;
}
