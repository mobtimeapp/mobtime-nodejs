import process from 'node:process';

const valueOr = (value, fallback) =>
  value === undefined
    ? fallback
    : value;

export const env = (key, fallback) =>
  valueOr(process.env[key], fallback);
