process.env.NODE_ENV = 'production';
process.env.SERVERLESS = true;

const createServer = require('./server');

module.exports = createServer;
