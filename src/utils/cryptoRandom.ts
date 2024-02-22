import crypto from 'crypto';

export const cryptpRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  return Array.from(randomArray, (number) => chars[number % chars.length]).join('');
};
