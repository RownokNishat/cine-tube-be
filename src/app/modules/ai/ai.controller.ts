import { Request, Response } from 'express';
import { AiService, ChatMessage } from './ai.service.js';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import httpStatus from 'http-status';

const chat = catchAsync(async (req: Request, res: Response) => {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
        return sendResponse(res, {
            httpStatusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'messages array is required',
            data: null,
        });
    }

    const reply = await AiService.chat(messages);

    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'AI response generated',
        data: { reply },
    });
});

export const AiController = { chat };
