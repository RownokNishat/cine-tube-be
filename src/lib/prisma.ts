import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";

// The '#' character in a database password breaks URL parsing (treated as fragment
// separator). Encode any unencoded '#' in the password segment so the URL is valid.
function getSafeConnectionString(): string {
    const url = process.env.DATABASE_URL as string;
    // Matches: scheme://user:PASSWORD@host — only encodes within the password part
    return url.replace(
        /^([a-z+.-]+:\/\/[^:]+):([^@]*)@/,
        (_, userPart, password) => `${userPart}:${password.replace(/#/g, '%23')}@`,
    );
}

const adapter = new PrismaPg({ connectionString: getSafeConnectionString() });
const prisma = new PrismaClient({ adapter });

export { prisma };

