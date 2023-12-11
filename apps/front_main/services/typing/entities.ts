import { IOrganization, IUser } from 'typing';

export type User = IUser & { id: number; password?: string };
export type Organization = IOrganization & { id: number };
