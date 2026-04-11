import { ChatStatus } from '../../../generated/enums.js';
import { prisma } from '../../../lib/prisma.js';

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

const getMySessions = async (userId: string) => {
    const result = await prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });
    return result;
};

const getAllSessions = async () => {
    const result = await prisma.chatSession.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { 
            user: { select: { id: true, name: true, email: true, image: true } },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 }
        }
    });
    return result;
};

const getSessionMessages = async (sessionId: string) => {
    const result = await prisma.chatMessage.findMany({
        where: { chatSessionId: sessionId },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, role: true, image: true } } }
    });
    return result;
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
