import { Router } from 'express';
import { asyncHandler } from '../../../infrastructure/middleware/asyncHandler.js';
import { authenticate, requireRole } from '../../../infrastructure/middleware/auth.middleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const router = Router();

// Require authentication for all task routes
router.use(asyncHandler(authenticate));

router.get('/', asyncHandler(getTasks));
router.post('/', requireRole(['Superadmin', 'Manager']), asyncHandler(createTask));
router.put('/:id', requireRole(['Superadmin', 'Manager']), asyncHandler(updateTask));
router.delete('/:id', requireRole(['Superadmin', 'Manager']), asyncHandler(deleteTask));

export default router;
