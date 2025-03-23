import type { FC, ReactNode } from 'react';

import { getUser } from '@/lib/get-user';

import { UserProvider as UserProviderClient } from './UserProvider.client';

interface UserProviderProps {
  children: ReactNode;
};

/** Load user (async suspended) and provide it to a global context to be consumed with `useUser()` */
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  return (
    <UserProviderClient user={getUser()}>
      {children}
    </UserProviderClient>
  );
};
