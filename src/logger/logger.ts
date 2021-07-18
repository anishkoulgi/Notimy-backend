import pino from 'pino';
import moment from 'moment';

export const logger = pino({
  name: 'server',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  prettyPrint: true,
  timestamp: () => `"time": ${moment().format('DD/MM/YYYY HH:mm:ss ')}`,
});
