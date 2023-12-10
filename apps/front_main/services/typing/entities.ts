import { IUser } from 'typing';

export type User = IUser & { id: number; password?: string };
