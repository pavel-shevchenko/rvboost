'use server';

import { cookies } from 'next/headers';

export async function setCookie(name: string, value: string) {
  cookies().set(name, value);
}

export async function getCookie(name: string) {
  return cookies().get(name)?.value;
}

export async function delCookie(name: string) {
  return cookies().delete(name);
}
