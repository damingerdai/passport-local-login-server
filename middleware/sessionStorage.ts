import RedisStore from 'connect-redis';
import { getEnvVars } from '../config/envVars';
import { redisUtil } from '../util';

const envVars = getEnvVars();
const redisClient = redisUtil.getRedisClient();

export const sessionStore = new RedisStore({
  client: redisClient,
  ttl: (envVars.SESSION_TTL) as number | 0,
});
