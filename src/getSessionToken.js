import { config } from 'dotenv';

let env;

export const getSessionToken = (filePath = '.env') => {
  if (!env) {
    env = config({ path: filePath });
  }
};
