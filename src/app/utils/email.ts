import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { envVars } from "../config/env.js";
import AppError from "../errorHelpers/AppError.js";

const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, unknown>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({ subject, templateData, templateName, to, attachments }: SendEmailOptions) => {
    try {
        const bundleDir = path.dirname(fileURLToPath(import.meta.url));
        const templatePath = envVars.NODE_ENV === 'production'
            ? path.resolve(bundleDir, 'templates', `${templateName}.ejs`)
            : path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

        const html = await ejs.renderFile(templatePath, templateData);

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html: html as string,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.log("Email Sending Error", msg);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};
