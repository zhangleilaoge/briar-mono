export const isDev = process.env.NODE_ENV !== 'production';

export const localHost = isDev ? '127.0.0.1' : '0.0.0.0'
