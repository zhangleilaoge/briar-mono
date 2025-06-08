export const isDev = process.env.NODE_ENV !== 'production';

// export const localHost = isDev ? '127.0.0.1' : '0.0.0.0';
export const localHost = '127.0.0.1';

export const origins = [
  /http(s)?:\/\/(www\.)?restrained-hunter\.website/,
  /http(s)?:\/\/localhost:5173/,
  /http(s)?:\/\/127\.0\.0\.1:5173/,
  /http(s)?:\/\/122\.51\.158\.41:5173/,
];
