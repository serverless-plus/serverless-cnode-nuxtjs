// https://github.com/isaacs/node-lru-cache
const LRU =  require('lru-cache');

const options = {
  max: 500,
  length: function(n, key) {
    return n * 2 + key.length;
  },
  maxAge: 1000 * 60 * 60
};
cache = new LRU(options); // sets just the max size

module.exports = cache;
