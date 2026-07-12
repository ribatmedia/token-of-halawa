import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters long'),
  REDIS_URL: z.string().url().optional(),
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000') // 15 mins
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const config = {
  port: parsedEnv.data.PORT,
  env: parsedEnv.data.NODE_ENV,
  db: {
    url: parsedEnv.data.DATABASE_URL
  },
  jwt: {
    secret: parsedEnv.data.JWT_SECRET,
    refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d'
  },
  redis: {
    url: parsedEnv.data.REDIS_URL
  },
  rateLimit: {
    max: parsedEnv.data.RATE_LIMIT_MAX,
    windowMs: parsedEnv.data.RATE_LIMIT_WINDOW_MS
  }
};
