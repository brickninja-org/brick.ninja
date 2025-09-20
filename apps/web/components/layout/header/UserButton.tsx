import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { SessionUser } from '@/lib/get-user';

import { Suspense } from 'react';
import { Skeleton } from '@heroui/react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';

import { getUser } from '@/lib/get-user';
import { getTranslate } from '@/lib/translate';
import { reauthorize } from '@/components/bn2-api/reauthorize';
import { LinkButton, SubmitButton } from '@/components/button';
import { Translate } from '@/components/i18n/Translate';

export interface UserButtonProps {
  language: Language,
}

export const UserButton: FC<UserButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<UserButtonInternal language={language} user="loading"/>}>
      <UserButtonLoader language={language}/>
    </Suspense>
  );
};

interface UserButtonInternalProps {
  user?: SessionUser | 'loading',
  language: Language,
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
      <LinkButton href="/login" icon="arrow-right-to-square" variant="ghost" className="min-w-10 w-10 md:min-w-20 md:w-fit rounded-sm font-normal" aria-label={t('login')}>
        <span className="hidden md:block"> <Translate id="login" language={language}/></span>
      </LinkButton>
    );
  }

  const button = (
    <LinkButton href="/profile" icon="person" variant="ghost" className="min-w-10 w-10 md:min-w-20 md:w-fit rounded-sm font-normal" aria-label={user === 'loading' ? undefined : user.name}>
      <span className="hidden md:block">{user === 'loading' ? <Skeleton className="h-4 w-24 rounded-lg"/> : user.name}</span>
    </LinkButton>
  );

  return (
    <Dropdown hideTop={false} button={button} preferredPlacement="bottom">
      <MenuList>
        <LinkButton variant="ghost" href="/profile" icon="person-pencil" className="justify-start rounded-sm font-normal">Profile</LinkButton>
        {user !== 'loading' && user.roles.includes('Admin') && (
          <LinkButton variant="ghost" icon="person-gear" href="/admin/users" className="justify-start rounded-sm font-normal">Admin</LinkButton>
        )}
        <form action="/logout" method="POST" className="flex">
          <SubmitButton className="justify-start rounded-sm font-normal" variant="ghost" icon="arrow-right-from-square" flex>Logout</SubmitButton>
        </form>
        <Separator/>
        <form action={reauthorize.bind(null, [], 'consent')} className="flex">
          <SubmitButton className="justify-start rounded-sm font-normal" variant="ghost" icon="persons-lock" flex>Manage Accounts</SubmitButton>
        </form>
      </MenuList>
    </Dropdown>
  );
};
