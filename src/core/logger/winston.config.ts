import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const contextName =
            typeof context === 'string' ? context : 'Application';
          const time = String(timestamp);
          const logLevel = String(level);
          const outputMessage =
            typeof message === 'string' ? message : JSON.stringify(message);

          return `${time} [${logLevel}] [${contextName}] ${outputMessage}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
