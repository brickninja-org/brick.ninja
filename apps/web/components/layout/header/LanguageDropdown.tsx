'use client';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Radio, RadioGroup } from '@heroui/react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
// import { Radiobutton } from '@brickninja-org/ui/components/form/Radiobutton';
// import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';
import type { TranslationSubset } from '@/lib/translate';

export interface LanguageDropdownProps {
  translations: TranslationSubset<
    | 'language.dropdown.label'
    | 'language.dropdown.settings'
  >;
}

const languages = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  nl: 'Nederlands',
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({ translations }) => {
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
          <Button radius="sm" variant="light" aria-label={localeName} className="min-w-10 w-10 md:min-w-20 md:w-fit" startContent={<Icon icon="globe"/>}>
            <span className="hidden md:block">{localeName}</span>
          </Button>
        )}
      >
        <RadioGroup
          className="pl-0 my-2"
          label={translations['language.dropdown.label']}
          size="sm"
          value={language}
          onValueChange={(value) => changeLanguage(value as Language)}
        >
          {Object.entries(languages).map(([code, label]) => (
            <Radio key={code} value={code}>{label}</Radio>
          ))}
        </RadioGroup>
        <Separator/>
        <Button radius="sm" variant="light" onPress={() => setFormatDialogOpen(true)}>{translations['language.dropdown.settings']}</Button>
      </Dropdown>

      <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
