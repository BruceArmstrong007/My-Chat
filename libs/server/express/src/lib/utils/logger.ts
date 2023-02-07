import pino from "pino";

export const logger = pino ({
      transport : {
        targets:[
        {
          level: 'info',
          target: 'pino-pretty',
          options:{
            colorize: true,
            translateTime : "SYS dd-mm-yyyy HH:MM:ss",
          },
        }, {
          level: 'info',
          target: 'pino/file',
          options: { destination: 'logs/server.log' }
        }
      ]
    },
    })
