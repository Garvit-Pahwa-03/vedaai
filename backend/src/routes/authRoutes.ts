import { Router } from 'express';
import { signup, verifyOTP, signin, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);
router.get('/me', authMiddleware, getMe);

export default router;