import { Role } from "../../generated/enums.js";
import { envVars } from "../config/env.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({ where: { role: Role.SUPER_ADMIN } });

        if (isSuperAdminExist) {
            console.log("Super admin already exists. Skipping seeding.");
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body: {
                email: envVars.SUPER_ADMIN_EMAIL,
                password: envVars.SUPER_ADMIN_PASSWORD,
                name: "Super Admin",
                role: Role.SUPER_ADMIN,
                needPasswordChange: false,
            },
        });

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: superAdminUser.user.id },
                data: { emailVerified: true },
            });

            await tx.adminProfile.create({
                data: {
                    userId: superAdminUser.user.id,
                },
            });
        });

        console.log("Super Admin Created:", envVars.SUPER_ADMIN_EMAIL);
    } catch (error) {
        console.error("Error seeding super admin:", error);
        try {
            await prisma.user.delete({ where: { email: envVars.SUPER_ADMIN_EMAIL } });
        } catch {
            // ignore cleanup errors
        }
    }
};
