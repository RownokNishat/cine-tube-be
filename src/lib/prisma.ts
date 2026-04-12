import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";

// The '#' character in a password breaks URL parsing (treated as fragment separator).
// Encode any unencoded '#' in the password segment so the URL is valid.
// Also switch to the transaction pooler (port 6543) for Vercel serverless — the session
// pooler (5432) has a small connection limit that serverless functions exhaust quickly.
function getSafeConnectionString(): string {
    const url = process.env.DATABASE_URL as string;

    return url
        .replace(
            /^([a-z+.-]+:\/\/[^:]+):([^@]*)@/,
            (_, userPart, password) => `${userPart}:${password.replace(/#/g, '%23')}@`,
        )
        // Switch session pooler (5432) → transaction pooler (6543) for serverless
        .replace(
            /(pooler\.supabase\.com):5432/,
            '$1:6543',
        );
}

// max: 1 — each Vercel function instance holds at most one connection.
// Without this, every cold start opens a new pool and the free-tier pooler
// hits its connection limit within seconds.
const adapter = new PrismaPg({ connectionString: getSafeConnectionString(), max: 1 });
const prisma = new PrismaClient({ adapter });

export { prisma };

