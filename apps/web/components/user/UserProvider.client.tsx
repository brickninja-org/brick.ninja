'use client';

import type { FC, ReactNode } from "react";
import type { SessionUser } from "@/lib/get-user";

import { useEffect } from "react";

import { extendUserSessionAction } from "./UserProvider.actions";
import { UserContext } from "./context";

interface UserProviderProps {
  children: ReactNode;
  user: Promise<SessionUser | undefined>;
}

export const UserProvider: FC<UserProviderProps> = ({ children, user }) => {
  useExtendSession(user);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

function useExtendSession(user: UserProviderProps['user']) {
  useEffect(() => {
    // wait for user to be loaded
    user.then((user) => {
      // if the session expires soon, call action to extend it
      if (user && expiresSoon(user.session.expiresAt)) {
        extendUserSessionAction();
      }
    })
  });
}

/** Check if the date is within the next 60 days */
function expiresSoon(date: Date | undefined) {
  if (!date) {
    return true;
  }

  const soon = new Date();
  soon.setDate(soon.getDate() + 60);

  return date < soon;
}
