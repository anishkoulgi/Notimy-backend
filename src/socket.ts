const socketio = require('socket.io');
import axios from 'axios';
import { receive } from './config/queue';
import { logger } from './logger/logger';
import User from './model/User';
import { addUser, getUsers, removeUser } from './users';

const configureWebSockets = (httpServer) => {
  const io = socketio(httpServer);

  io.on('connect', (socket) => {
    socket.on('join', ({ userId }, callback) => {
      const { error, user } = addUser({
        id: socket.id,
        userId,
      });
      logger.info(getUsers());
      if (error) return callback(error);

      socket.join(user.userId);
    });

    // Disconnection
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      console.log('From disconnect', user);
      if (user?.userId) socket.leave(user?.userId);
    });
  });

  receive('socket', async ({ record, userId }) => {
    const clients = io.sockets.adapter.rooms.get(userId);

    if (!clients) {
      // Send Push Notification
      const user = await User.findById(userId);
      const { expoToken } = user;
      const res = await axios.post(
        'https://exp.host/--/api/v2/push/send',
        {
          to: expoToken,
          body: record.url,
          title: record.text,
          sound: 'default',
        },
        {
          headers: {
            host: 'exp.host',
            accept: 'application/json',
            'accept-encoding': 'gzip, deflate',
            'content-type': 'application/json',
          },
        }
      );
      console.log('In Send Push Notification');
      console.log(res);
      return;
    }
    console.log('In Receive', clients);
    console.log(record, userId, 'oidsoifhasihfoidf');
    io.to(userId).emit('message', { message: record });
  });
};

module.exports = configureWebSockets;
