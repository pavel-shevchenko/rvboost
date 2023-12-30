import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility } from 'casl/src/defineUserAbility';

// @ts-ignore
export const CaslContext = createContext<AppAbility>();

export const Can = createContextualCan(CaslContext.Consumer);
