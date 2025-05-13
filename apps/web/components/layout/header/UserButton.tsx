import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { SessionUser } from '@/lib/get-user';

import { Suspense } from 'react';
import { Button, Link } from '@heroui/react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Icon } from '@brickninja-org/ui/icons';

import { getUser } from '@/lib/get-user';
import { getTranslate } from '@/lib/translate';
import { reauthorize } from '@/components/bn2-api/reauthorize';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Translate } from '@/components/i18n/Translate';

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
      <Button as={Link} radius="sm" variant="light" href="/login" className="min-w-10 w-10 md:min-w-20 md:w-fit" aria-label={t('login')}>
        <Icon icon="user"/><span className="hidden md:block"> <Translate id="login" language={language}/></span>
      </Button>
    );
  }

  const button = (
    <Button as={Link} startContent={<Icon icon="user"/>} radius="sm" variant="light" href="/profile" className="min-w-10 w-10 md:min-w-20 md:w-fit" aria-label={user === 'loading' ? undefined : user.name}>
      <span className="hidden md:block">{user === 'loading' ? <Skeleton width={90}/> : user.name}</span>
    </Button>
  );

  return (
    <Dropdown hideTop={false} button={button} preferredPlacement="bottom">
      <MenuList>
        <LinkButton appearance="menu" href="/profile" icon="user">Profile</LinkButton>
        {user !== 'loading' && user.roles.includes('Admin') && (
          <LinkButton appearance="menu" icon="developer" href="/admin/users">Admin</LinkButton>
        )}
        <form action="/logout" method="POST" className="flex">
          <SubmitButton appearance="menu" icon="logout" flex>Logout</SubmitButton>
        </form>
        <Separator/>
        <form action={reauthorize.bind(null, [], 'consent')} className="flex">
          <SubmitButton appearance="menu" icon="unlock" flex>Manage Accounts</SubmitButton>
        </form>
      </MenuList>
    </Dropdown>
  );
};
