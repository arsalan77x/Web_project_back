// Mapper for environment variables
const environment = process.env.NODE_ENV || 'development';
const back_port = process.env.PORT || 3001;
const CONFIG_ID = process.env.CONFIG_ID || '617822c0d4978297215a0043';

const db = {
  name: process.env.DB_NAME || 'tarasht',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '27017',
  user: process.env.DB_USER || 't4r4sht',
  password: process.env.DB_PASS || 't4r4shtt',
};


const corsUrl = process.env.CORS_URL;

const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '30'),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '120'),
  issuer: process.env.TOKEN_ISSUER || 'mrbug',
  audience: process.env.TOKEN_AUDIENCE || 'mrbug',
};

const logDirectory = process.env.LOG_DIR || './logs';

module.exports = {
  environment,
  back_port,
  db,
  corsUrl,
  tokenInfo,
  logDirectory,
  CONFIG_ID
}