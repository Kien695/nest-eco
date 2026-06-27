import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config({
  path: '.env',
});
//kiểm tra file env có tồn tại
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file env');
  process.exit(1);
}
const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRED: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRED: z.string(),
  SECRET_API_KEY: z.string(),
  OTP_EXPIRES_IN: z.string(),
  RESEND_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),
});

const configServer = configSchema.safeParse(process.env);
if (!configServer.success) {
  console.log('Các giá trị trong file env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
