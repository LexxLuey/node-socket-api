import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = Container.get(AuthController);

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
