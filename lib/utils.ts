import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomString(length: number, filter: RegExp = /[A-Za-z0-9]/g) {
  let str = '';
  let chars = 'aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';

  for (let i = 0; i < length; i++) {
    if (chars.match(filter)) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    } else {
      i--;
    }
  }

  return str;
}

export function capitalizeLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getImageProvider() {
  const externalProvider = process.env.IMAGE_PROVIDER || 'http://localhost:8080';
  const developmentProvider = process.env.SITE_URL || 'http://localhost:3000';

  if (process.env.NODE_ENV === 'development') {
    return developmentProvider;
  }
  return externalProvider;
}