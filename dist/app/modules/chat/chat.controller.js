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
    const result = await ChatService.getMySessions(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Chat sessions fetched successfully',
        data: result,
    });
});
const getAllSessions = catchAsync(async (req, res) => {
    const result = await ChatService.getAllSessions();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'All chat sessions fetched successfully',
        data: result,
    });
});
const getSessionMessages = catchAsync(async (req, res) => {
    const sessionId = req.params.sessionId;
    const result = await ChatService.getSessionMessages(sessionId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Messages fetched successfully',
        data: result,
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