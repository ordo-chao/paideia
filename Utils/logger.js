import pino from 'pino';
import pretty from 'pino-pretty';

const stream = process.stdout.isTTY
  ? pretty({ colorize: true, translateTime: 'SYS:standard' })
  : process.stdout;

const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, stream);

export { logger };