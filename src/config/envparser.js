const DotEnv = require('dotenv')
const parsedEnv = DotEnv.config().parsed
console.log(`Parsed .env file:
${JSON.stringify(parsedEnv)}
`)
module.exports = parsedEnv
