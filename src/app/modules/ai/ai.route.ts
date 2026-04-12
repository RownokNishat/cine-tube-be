import express from 'express';
import { AiController } from './ai.controller.js';
import { checkAuth as auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/enums.js';

const router = express.Router();

router.post('/chat', auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), AiController.chat);

export const AiRoutes = router;
