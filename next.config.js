const env = require('dotenv')

env.config()

module.exports={
  publicRuntimeConfig: {
    apiKey: process.env.API_KEY
  }
}
