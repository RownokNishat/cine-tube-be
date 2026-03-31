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
export declare const sendEmail: ({ subject, templateData, templateName, to, attachments }: SendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map