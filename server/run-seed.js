// Wrapper to set DNS before running seed
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('./seed');
