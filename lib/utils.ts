import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomString(length: number, filter: RegExp = /[A-Za-z0-9]/g): string {
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

export function generateRating(sum: number, total: number) {
  let fullStars = Math.floor(sum / total);
  let halfStars = (sum % total != 0) ? 1 : 0;
  let emptyStars = (5 - fullStars);

  return [fullStars, halfStars, emptyStars];
}