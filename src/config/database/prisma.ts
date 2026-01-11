import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is not defined");
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

export async function connectPrisma() {
    await prisma.$connect();
    console.log("✅ Prisma MongoDB connected");
}

export default prisma;
