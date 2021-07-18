import { receive, send } from '../config/queue';
import { logger } from '../logger/logger';
import { createMessage } from '../services/messageService';
import db from '../config/db';

db();

const handleIncoming = async ({ message, userId }) => {
  try {
    const result = await createMessage(message, userId);
    send('socket', { record: result, userId });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

receive('incoming', handleIncoming);
