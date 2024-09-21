import { createContext } from 'react';

import type { SessionUser } from '@/lib/get-user';

export interface UserContext {
  user: SessionUser | undefined;
  loading: boolean;
}

export const UserContext = createContext<UserContext>({ user: undefined, loading: true });
export const SetUserContext = createContext<(context: UserContext) => void>(() => {});
