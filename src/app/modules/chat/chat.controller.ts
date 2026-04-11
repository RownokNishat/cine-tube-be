import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createSession = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await ChatService.createSession(userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Chat session created successfully',
        data: result,
    });
});

const getMySessions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await ChatService.getMySessions(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chat sessions fetched successfully',
        data: result,
    });
});

const getAllSessions = catchAsync(async (req: Request, res: Response) => {
    const result = await ChatService.getAllSessions();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All chat sessions fetched successfully',
        data: result,
    });
});

const getSessionMessages = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const result = await ChatService.getSessionMessages(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages fetched successfully',
        data: result,
    });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?.id;
    const result = await ChatService.sendMessage(senderId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
});

const updateSessionStatus = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { status } = req.body;
    const result = await ChatService.updateSessionStatus(sessionId, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Session status updated successfully',
        data: result,
    });
});

export const ChatController = {
    createSession,
    getMySessions,
    getAllSessions,
    getSessionMessages,
    sendMessage,
    updateSessionStatus
};
