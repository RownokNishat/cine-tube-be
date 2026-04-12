import { ChatStatus } from '../../../generated/enums.js';
import { prisma } from '../../../lib/prisma.js';

const buildMeta = (page: number, limit: number, total: number) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});

const createSession = async (userId: string) => {
    const activeSession = await prisma.chatSession.findFirst({
        where: { userId, status: ChatStatus.OPEN },
        include: { messages: true }
    });

    if (activeSession) {
        return activeSession;
    }

    const newSession = await prisma.chatSession.create({
        data: { userId },
        include: { messages: true }
    });
    return newSession;
};

const getMySessions = async (userId: string, page = 1, limit = 10) => {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        prisma.chatSession.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: safeLimit,
            include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
        }),
        prisma.chatSession.count({ where: { userId } }),
    ]);

    return { data, meta: buildMeta(safePage, safeLimit, total) };
};

const getAllSessions = async (page = 1, limit = 10) => {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        prisma.chatSession.findMany({
            orderBy: { updatedAt: 'desc' },
            skip,
            take: safeLimit,
            include: { 
                user: { select: { id: true, name: true, email: true, image: true } },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            }
        }),
        prisma.chatSession.count(),
    ]);

    return { data, meta: buildMeta(safePage, safeLimit, total) };
};

const getSessionMessages = async (sessionId: string, page = 1, limit = 25) => {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [messages, total] = await Promise.all([
        prisma.chatMessage.findMany({
            where: { chatSessionId: sessionId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
            include: { sender: { select: { id: true, name: true, role: true, image: true } } }
        }),
        prisma.chatMessage.count({ where: { chatSessionId: sessionId } }),
    ]);

    return {
        data: messages.reverse(),
        meta: buildMeta(safePage, safeLimit, total),
    };
};

const sendMessage = async (senderId: string, payload: { chatSessionId: string, content?: string, imageUrl?: string }) => {
    const result = await prisma.$transaction(async (tx: any) => {
        const message = await tx.chatMessage.create({
            data: {
                chatSessionId: payload.chatSessionId,
                senderId,
                content: payload.content,
                imageUrl: payload.imageUrl
            },
            include: { sender: { select: { id: true, name: true, role: true, image: true } } }
        });

        await tx.chatSession.update({
            where: { id: payload.chatSessionId },
            data: { updatedAt: new Date() }
        });

        return message;
    });

    return result;
};

const updateSessionStatus = async (sessionId: string, status: ChatStatus) => {
    const result = await prisma.chatSession.update({
        where: { id: sessionId },
        data: { status }
    });
    return result;
};

export const ChatService = {
    createSession,
    getMySessions,
    getAllSessions,
    getSessionMessages,
    sendMessage,
    updateSessionStatus
};
