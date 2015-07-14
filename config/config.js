// Set to operate in which mode app is running in - Dev or Prod mode.json
module.exports = require('./' + (process.env.NODE_ENV || 'development') + '.json');
