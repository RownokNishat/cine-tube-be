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
    getMySessions: (userId: string) => Promise<({
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
    })[]>;
    getAllSessions: () => Promise<({
        user: {
            name: string;
            id: string;
            email: string;
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
    })[]>;
    getSessionMessages: (sessionId: string) => Promise<({
        sender: {
            name: string;
            role: import("../../../generated/enums.js").Role;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string | null;
        chatSessionId: string;
        senderId: string;
        imageUrl: string | null;
    })[]>;
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