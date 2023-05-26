const ENVIRONMENT_VARIABLES = {
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  REDIS_PASSWORD: '',
  SESSION_TTL: 2 * 60 * 60,
  SESSION_SECRET: '',
} as Record<string, string | number>;

let fetched = false;

export const getEnvVars = () => {
  if (fetched) {
    return ENVIRONMENT_VARIABLES;
  }

  Object.keys(ENVIRONMENT_VARIABLES).forEach((envVarName) => {
    ENVIRONMENT_VARIABLES[envVarName] = 
      typeof process.env[envVarName] === 'undefined'
        ? ENVIRONMENT_VARIABLES[envVarName] || ''
        : process.env[envVarName] ?? '';
  });

  fetched = true;

  return ENVIRONMENT_VARIABLES;
}
