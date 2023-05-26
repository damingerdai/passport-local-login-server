
import * as redis from 'redis';
import { promisify } from 'util';
import { getEnvVars } from '../config/envVars';

const envVars = getEnvVars();
let getPromise = null;
let setPromise = null;
let setNXPromise = null;
let setExpirePromise = null;
let incrPromise = null;
let decrPromise = null;
let redisClient = null;

const getRedisValue = (key: string) => {
  const client = getRedisClient();
  if (!getPromise) {
    getPromise = promisify(client.get).bind(client);
  }

  return getPromise(key);
};

const getAllKeys = () => {
  const client = getRedisClient();
  if (!getPromise) {
    getPromise = promisify(client.keys).bind(client);
  }

  return getPromise('*');
};

const setRedisValue = (key: string, value: string, timeOut?: number) => {
  const client = getRedisClient();
  if (!setPromise) {
    setPromise = promisify(client.set).bind(client);
  }

  return timeOut
    ? setPromise(key, value, 'EX', timeOut)
    : setPromise(key, value);
};

const setNXRedisValue = (key: string, value: string) => {
  const client = getRedisClient();
  if (!setNXPromise) {
    setNXPromise = promisify(client.setnx).bind(client);
  }

  return setNXPromise(key, value);
};

const setExpire = (key: string, value: number) => {
  const client = getRedisClient();
  if (!setExpirePromise) {
    setExpirePromise = promisify(client.expire).bind(client);
  }

  return setExpirePromise(key, value);
};

const incrRedisValue = (key: string) => {
  const client = getRedisClient();
  if (!incrPromise) {
    incrPromise = promisify(client.incr).bind(client);
  }

  return incrPromise(key);
};

const decrRedisValue = (key: string) => {
  const client = getRedisClient();
  if (!decrPromise) {
    decrPromise = promisify(client.decr).bind(client);
  }

  return decrPromise(key);
};

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      socket: {
        host: envVars.REDIS_HOST as string,
        port: envVars.REDIS_PORT as number,
      },
      password: envVars.REDIS_PASSWORD as string,
    });
  }
  redisClient.on('error', function (err) {
    console.error('Could not establish a connection with redis. ' + err);
  });
  redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
  });

  return redisClient;
};

getRedisClient();
redisClient.connect();

export const redisUtil = {
  getRedisValue,
  setRedisValue,
  setNXRedisValue,
  setExpire,
  getRedisClient,
  getAllKeys,
  incrRedisValue,
  decrRedisValue,
};
