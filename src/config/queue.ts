import amqp from 'amqplib';
import { logger } from '../logger/logger';

require('dotenv').config();

const getChannel = async () => {
  try {
    const amqpServer = process.env.RABBIT_URI;
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    logger.error(error);
  }
};

export const send = async (queue, message) => {
  try {
    const channel = await getChannel();
    const encodedMessage = JSON.stringify(message);
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(encodedMessage));
    logger.info('Sent to "%s" message %s', queue, encodedMessage);
  } catch (error) {
    logger.error(error);
  }
};

export const receive = async (queue, handler) => {
  try {
    const channel = await getChannel();
    channel.assertQueue(queue, { durable: false });
    logger.info('Listening for messages on queue "%s"', queue);
    channel.consume(
      queue,
      (msg) => handler(JSON.parse(msg.content.toString())),
      {
        noAck: true,
      }
    );
  } catch (error) {
    logger.error(error);
  }
};
