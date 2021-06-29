const Pino = require('pino')();

Pino.level = process.env.FLOURISH_LOGLEVEL || 'debug'

export const getLogger = (name) => Pino.child({module: name});

