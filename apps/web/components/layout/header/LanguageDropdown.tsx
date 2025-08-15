'use client';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Divider, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup } from '@heroui/react';

import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';
import type { TranslationSubset } from '@/lib/translate';

export interface LanguageDropdownProps {
  translations: TranslationSubset<
    | 'locale.formatting.settings'
    | 'language.select.label'
    | 'language.select.placeholder'
    | 'region.select.label'
    | 'region.select.placeholder'
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
      <Popover showArrow placement="bottom" radius="sm" shadow="md">
        <PopoverTrigger>
          <Button
            aria-label={localeName}
            className="min-w-10 w-10 md:min-w-20 md:w-fit"
            radius="sm"
            startContent={<Icon icon="globe"/>}
            variant="light"
          >
            <span className="hidden md:block">{localeName}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <RadioGroup
            className="px-2 my-2"
            size="sm"
            value={language}
            onValueChange={(value) => changeLanguage(value as Language)}
          >
            {Object.entries(languages).map(([code, label]) => (
              <Radio key={code} value={code}>{label}</Radio>
            ))}
          </RadioGroup>
          <Divider className="mb-2"/>
          <Button radius="sm" variant="light" onPress={() => setFormatDialogOpen(true)}>{translations['locale.formatting.settings']}</Button>
        </PopoverContent>
      </Popover>

      <FormatConfigDialog translations={translations} open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
