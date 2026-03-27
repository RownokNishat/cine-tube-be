import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { Role, UserStatus } from "../generated/enums.js";
import { envVars } from "../app/config/env.js";
import { sendEmail } from "../app/utils/email.js";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            mapProfileToUser: () => ({
                role: Role.USER,
                status: UserStatus.ACTIVE,
                needPasswordChange: false,
                emailVerified: true,
                isDeleted: false,
                deletedAt: null,
            }),
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.USER,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE,
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            },
        },
    },

    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user) {
                        console.error(`User with email ${email} not found.`);
                        return;
                    }

                    if (user.role === Role.SUPER_ADMIN) {
                        console.log(`Super admin ${email}: skipping OTP email.`);
                        return;
                    }

                    if (user && !user.emailVerified) {
                        sendEmail({
                            to: email,
                            subject: "Verify your CineTube account",
                            templateName: "otp",
                            templateData: { name: user.name, otp },
                        });
                    }
                } else if (type === "forget-password") {
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (user) {
                        sendEmail({
                            to: email,
                            subject: "CineTube - Password Reset OTP",
                            templateName: "otp",
                            templateData: { name: user.name, otp },
                        });
                    }
                }
            },
            expiresIn: 2 * 60,
            otpLength: 6,
        }),
    ],

    session: {
        expiresIn: 60 * 60 * 24,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24,
        },
    },

    redirectURLs: {
        signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },

    trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL, "http://localhost:3000", "http://localhost:5000"],

    advanced: {
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                },
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                },
            },
        },
    },
});
