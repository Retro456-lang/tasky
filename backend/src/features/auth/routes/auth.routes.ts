import { Router } from 'express';
import { asyncHandler } from '../../../infrastructure/middleware/asyncHandler.js';
import { authenticate } from '../../../infrastructure/middleware/auth.middleware.js';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));
router.get('/me', asyncHandler(authenticate), asyncHandler(getMe));

export default router;
