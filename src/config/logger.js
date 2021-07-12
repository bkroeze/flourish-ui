import { createLogger, StringifyObjectsHook } from 'vue-logger-plugin'

// create logger with options
const logger = createLogger({
  enabled: true,
  level: 'debug',
  beforeHooks: [ StringifyObjectsHook ]
})

export default logger
