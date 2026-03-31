import { IQueryParams } from "../../interfaces/query.interface.js";
export declare const ContentService: {
    getAboutContent: () => Promise<{
        title: string;
        mission: string;
        highlights: string[];
    }>;
    getFaqContent: () => Promise<{
        question: string;
        answer: string;
    }[]>;
    createContactMessage: (payload: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }) => Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        isRead: boolean;
    }>;
    getContactMessages: (queryParams: IQueryParams) => Promise<{
        data: {
            name: string;
            subject: string;
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            message: string;
            isRead: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markContactMessageRead: (id: string) => Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        isRead: boolean;
    }>;
};
//# sourceMappingURL=content.service.d.ts.map