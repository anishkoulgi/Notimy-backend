import express from 'express';
import {
  createUserController,
  getUserController,
  loginUserController,
} from '../controllers/UserControllers';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

// @route    POST /register
// @desc     Create new User
// @access   Public
router.post('/register', createUserController);

// @route    POST /login
// @desc     Login User
// @access   Public
router.post('/login', loginUserController);

// @route    GET /getuser
// @desc     Get user with specified ID
// @access   Public
router.get('/getuser', verifyToken, getUserController);

export default router;
