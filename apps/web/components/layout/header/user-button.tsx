import { Suspense, type FC } from 'react';
import { IoPersonOutline } from 'react-icons/io5';

import type { Language } from '@brickninja-org/database';
import { Dropdown } from '@brickninja-org/ui/components/dropdown';
import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { MenuList } from '@brickninja-org/ui/components/layout/menu-list';

import { getUser, type SessionUser } from '@/lib/get-user';
import { Skeleton } from '@/components/skeleton';

export interface UserButtonProps {
  language: Language;
}

export const UserButton: FC<UserButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<UserButtonInternal language={language} user="loading"/>}>
      <UserButtonLoader language={language}/>
    </Suspense>
  );
};

interface UserButtonInternalProps {
  user?: SessionUser | 'loading';
  language: Language;
}

// internal component to load the user
const UserButtonLoader: FC<UserButtonProps> = async ({ language }) => {
  const user = await getUser();

  return <UserButtonInternal language={language} user={user}/>;
};

// internal component to show loader | user | login
const UserButtonInternal: FC<UserButtonInternalProps> = ({ user }) => {
  if (!user) {
    return (
      <LinkButton appearance="menu" href="/login" aria-label="Login" className="gap-1 px-3" icon={<IoPersonOutline size={20}/>}>
        <span className="hidden md:block">Login</span>
      </LinkButton>
    );
  }

  const button = (
    <LinkButton appearance="menu" href="/profile" aria-label={user === 'loading' ? undefined : user.name}>
      <span className="">{user === 'loading' ? <Skeleton width={90}/> : user.name}</span>
    </LinkButton>
  );

  return (
    <Dropdown hideTop={false} button={button} preferredPlacement="bottom">
      <MenuList>
        <LinkButton appearance="menu" href="/profile">Profile</LinkButton>
        {user !== 'loading' && user.roles.includes('Admin') && (
          <LinkButton appearance="menu" href="/admin/users">Admin</LinkButton>
        )}
        <LinkButton appearance="menu" external href="/logout">Logout</LinkButton>
      </MenuList>
    </Dropdown>
  );
};