import { Role } from "../../generated/enums.js";
import { envVars } from "../config/env.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
export const seedSuperAdmin = async () => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: envVars.SUPER_ADMIN_EMAIL },
            include: { adminProfile: true },
        });
        if (existingUser?.adminProfile) {
            console.log("Super admin already exists. Skipping seeding.");
            return;
        }
        let userId;
        if (existingUser) {
            // User exists but adminProfile is missing — recover from a previous partial run
            userId = existingUser.id;
        }
        else {
            const superAdminUser = await auth.api.signUpEmail({
                body: {
                    email: envVars.SUPER_ADMIN_EMAIL,
                    password: envVars.SUPER_ADMIN_PASSWORD,
                    name: "Super Admin",
                    role: Role.SUPER_ADMIN,
                    needPasswordChange: false,
                },
            });
            userId = superAdminUser.user.id;
        }
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { emailVerified: true, role: Role.SUPER_ADMIN },
            });
            await tx.adminProfile.create({
                data: { userId },
            });
        });
        console.log("Super Admin Created:", envVars.SUPER_ADMIN_EMAIL);
    }
    catch (error) {
        console.error("Error seeding super admin:", error);
        try {
            await prisma.user.delete({ where: { email: envVars.SUPER_ADMIN_EMAIL } });
        }
        catch {
            // ignore cleanup errors
        }
    }
};
//# sourceMappingURL=seed.js.map