import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
const getAboutContent = async () => {
    return {
        title: "About CineTube",
        mission: "CineTube helps people discover, rate, and discuss movies and series while giving admins tools to moderate high-quality content.",
        highlights: [
            "Explore movies and series with rich filters",
            "Rate titles on a 1-10 scale and share thoughtful reviews",
            "Save favorites to your watchlist",
            "Subscribe or purchase premium content securely",
        ],
    };
};
const getFaqContent = async () => {
    return [
        {
            question: "How do ratings work?",
            answer: "You can rate any title from 1 to 10 and optionally add a written review.",
        },
        {
            question: "Why is my review not visible yet?",
            answer: "Reviews may require moderation before being published.",
        },
        {
            question: "Can I edit or delete my review?",
            answer: "Yes. You can edit or delete your own review while it is unpublished.",
        },
        {
            question: "How do rentals work?",
            answer: "Rental access is time-limited (for example, 7 or 30 days) and expires automatically.",
        },
    ];
};
const createContactMessage = async (payload) => {
    const created = await prisma.contactMessage.create({
        data: payload,
    });
    return created;
};
const getContactMessages = async (queryParams) => {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const isReadParam = typeof queryParams.isRead === "string" ? queryParams.isRead.toLowerCase() : undefined;
    const where = isReadParam === "true"
        ? { isRead: true }
        : isReadParam === "false"
            ? { isRead: false }
            : {};
    const [data, total] = await Promise.all([
        prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.contactMessage.count({ where }),
    ]);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const markContactMessageRead = async (id) => {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, "Contact message not found");
    }
    return prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
    });
};
export const ContentService = {
    getAboutContent,
    getFaqContent,
    createContactMessage,
    getContactMessages,
    markContactMessageRead,
};
//# sourceMappingURL=content.service.js.map