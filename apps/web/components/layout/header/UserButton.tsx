import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { SessionUser } from '@/lib/get-user';

import { Suspense } from 'react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';

import { getUser } from '@/lib/get-user';
import { getTranslate } from '@/lib/translate';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Translate } from '@/components/i18n/Translate';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

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
const UserButtonInternal: FC<UserButtonInternalProps> = ({ user, language }) => {
  const t = getTranslate(language);

  if (!user) {
    return (
      <LinkButton appearance="menu" href="/login" aria-label={t('login')} className="gap-1 px-3" icon="person">
        <span className="hidden md:block"><Translate id="login" language={language}/></span>
      </LinkButton>
    );
  }

  const button = (
    <LinkButton appearance="menu" href="/profile" aria-label={user === 'loading' ? undefined : user.name} icon="person">
      <span className="">{user === 'loading' ? <Skeleton width={90}/> : user.name}</span>
    </LinkButton>
  );

  return (
    <Dropdown hideTop={false} button={button} preferredPlacement="bottom">
      <MenuList>
        <LinkButton appearance="menu" href="/profile" icon="person">Profile</LinkButton>
        {user !== 'loading' && user.roles.includes('Admin') && (
          <LinkButton appearance="menu" icon="developer" href="/admin/users">Admin</LinkButton>
        )}
        <form action="/logout" method="POST" className="flex">
          <SubmitButton appearance="menu" icon="logout" flex>Logout</SubmitButton>
        </form>
      </MenuList>
    </Dropdown>
  );
};
