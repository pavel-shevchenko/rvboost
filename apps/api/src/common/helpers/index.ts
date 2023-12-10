import * as bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hash(password, 5);
