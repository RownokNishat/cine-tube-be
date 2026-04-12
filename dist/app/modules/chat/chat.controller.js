import { ChatService } from './chat.service.js';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import httpStatus from 'http-status';
const createSession = catchAsync(async (req, res) => {
    const userId = req.user?.userId;
    const result = await ChatService.createSession(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: 'Chat session created successfully',
        data: result,
    });
});
const getMySessions = catchAsync(async (req, res) => {
    const userId = req.user?.userId;
    const query = req.query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const result = await ChatService.getMySessions(userId, page, limit);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Chat sessions fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const getAllSessions = catchAsync(async (req, res) => {
    const query = req.query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const result = await ChatService.getAllSessions(page, limit);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'All chat sessions fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const getSessionMessages = catchAsync(async (req, res) => {
    const sessionId = req.params.sessionId;
    const query = req.query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 25;
    const result = await ChatService.getSessionMessages(sessionId, page, limit);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Messages fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const sendMessage = catchAsync(async (req, res) => {
    const senderId = req.user?.userId;
    const result = await ChatService.sendMessage(senderId, req.body);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
});
const updateSessionStatus = catchAsync(async (req, res) => {
    const sessionId = req.params.sessionId;
    const status = req.body.status;
    const result = await ChatService.updateSessionStatus(sessionId, status);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
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
//# sourceMappingURL=chat.controller.js.map