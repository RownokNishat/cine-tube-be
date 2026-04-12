import { ChatStatus } from '../../../generated/enums.js';
export declare const ChatService: {
    createSession: (userId: string) => Promise<{
        messages: {
            id: string;
            createdAt: Date;
            content: string | null;
            chatSessionId: string;
            senderId: string;
            imageUrl: string | null;
        }[];
    } & {
        status: ChatStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getMySessions: (userId: string, page?: number, limit?: number) => Promise<{
        data: ({
            messages: {
                id: string;
                createdAt: Date;
                content: string | null;
                chatSessionId: string;
                senderId: string;
                imageUrl: string | null;
            }[];
        } & {
            status: ChatStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllSessions: (page?: number, limit?: number) => Promise<{
        data: ({
            user: {
                name: string;
                id: string;
                email: string;
                image: string | null;
            };
            messages: {
                id: string;
                createdAt: Date;
                content: string | null;
                chatSessionId: string;
                senderId: string;
                imageUrl: string | null;
            }[];
        } & {
            status: ChatStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSessionMessages: (sessionId: string, page?: number, limit?: number) => Promise<{
        data: ({
            sender: {
                name: string;
                role: import("../../../generated/enums.js").Role;
                id: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string | null;
            chatSessionId: string;
            senderId: string;
            imageUrl: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    sendMessage: (senderId: string, payload: {
        chatSessionId: string;
        content?: string;
        imageUrl?: string;
    }) => Promise<any>;
    updateSessionStatus: (sessionId: string, status: ChatStatus) => Promise<{
        status: ChatStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
};
//# sourceMappingURL=chat.service.d.ts.map