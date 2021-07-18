import { Request, Response } from 'express';
import { send } from '../config/queue';
import { logger } from '../logger/logger';
import { getMessages } from '../services/messageService';
import { MessageDocument } from '../types/messageTypes';

export const webhookController = async (req: Request, res: Response) => {
  const message: MessageDocument = {
    text: req.body.text,
    createdAt: new Date(),
  };
  try {
    const userId = req.params.userId;
    const resp = await send('incoming', { message, userId });
    // const result = await createMessage(message);
    // console.log(result);

    res.status(200).json({ msg: 'Message received Successfully' });
  } catch (error) {
    console.log('Error in creating message');
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const listController = async (req: Request, res: Response) => {
  try {
    const result = await getMessages();
    //console.log(result);
    res.status(200).send(result);
  } catch (error) {
    console.log('Error in fetching messages');
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const githubController = async (req: Request, res: Response) => {
  logger.info(JSON.stringify(req.body));

  try {
    const userId = req.params.userId;
    const {
      repository: { name: repoName },
      pull_request: { title: prTitle, html_url: prUrl },
      action,
    } = req.body;

    const message = {
      text: `PR ${action} for repo ${repoName}: ${prTitle}`,
      url: prUrl,
    };
    console.log(message);

    const resp = await send('incoming', { message, userId });

    res.status(200).json({ msg: 'Message received Successfully' });
  } catch (error) {
    console.log('Error in creating message');
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
