import express from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/session', auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.createSession);
router.get('/my-sessions', auth(Role.USER), ChatController.getMySessions);
router.get('/admin-sessions', auth(Role.ADMIN, Role.SUPER_ADMIN), ChatController.getAllSessions);
router.get('/session/:sessionId/messages', auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.getSessionMessages);
router.post('/message', auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.sendMessage);
router.patch('/session/:sessionId/status', auth(Role.ADMIN, Role.SUPER_ADMIN), ChatController.updateSessionStatus);

export const ChatRoutes = router;
