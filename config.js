const crypto = require('crypto');

module.exports = {
    jwtSecret: crypto.randomBytes(32).toString('hex')
  };