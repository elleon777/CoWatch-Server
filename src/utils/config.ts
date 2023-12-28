import * as url from 'url';

export const PORT = process.env.PORT || 9999;
export const CLIENT_HOST = 'http://localhost:5173';

export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
