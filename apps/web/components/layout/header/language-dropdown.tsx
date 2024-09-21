'use client';

import { useCallback, useState, type FC } from 'react';
import { useRouter } from 'next/navigation';

import type { Language } from '@brickninja-org/database';
import { Dropdown } from '@brickninja-org/ui/components/dropdown';
import { Button } from '@brickninja-org/ui/components/form/button';
import { Radiobutton } from '@brickninja-org/ui/components/form/radiobutton';
import { MenuList } from '@brickninja-org/ui/components/layout/menu-list';
import { Separator } from '@brickninja-org/ui/components/layout/separator';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/format-config-dialog';

const languages = {
  en: 'English',
  nl: 'Nederlands',
};

export const LanguageDropdown: FC = () => {
  const { push } = useRouter();

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const language = useLanguage();
  const localeName = languages[language];

  const changeLanguage = useCallback((language: Language) => {
    const url = new URL(window.location.href);
    url.hostname = language + url.hostname.substring(2);
    push(url.href);
  }, [push]);

  return (
    <>
      <Dropdown
        hideTop={false}
        preferredPlacement="bottom"
        button={(
          <Button appearance="menu" aria-label={localeName}>
            {localeName}
          </Button>
        )}
      >
        <MenuList>
          <Radiobutton checked={language === 'en'} onChange={() => changeLanguage('en')}>{languages.en}</Radiobutton>
          <Radiobutton checked={language === 'nl'} onChange={() => changeLanguage('nl')}>{languages.nl}</Radiobutton>
          <Separator/>
          <Button onClick={() => setFormatDialogOpen(true)} appearance="menu">Formatting Settings</Button>
        </MenuList>
      </Dropdown>

      <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
