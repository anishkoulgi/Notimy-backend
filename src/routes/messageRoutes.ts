import express from 'express';
import {
  githubController,
  listController,
  webhookController,
} from '../controllers/messageControllers';

const router = express.Router();

// @route    POST /webhook
// @desc     Create new message
// @access   Private
router.post('/:userId', webhookController);

// @route    POST /webhook/github
// @desc     Create new github message
// @access   Private
router.post('/github/:userId', githubController);

// @route    GET /webhook
// @desc     Get All message
// @access   Private
router.get('/:userId', listController);

export default router;
