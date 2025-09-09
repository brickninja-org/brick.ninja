'use client';

import type { FC, Key } from 'react';
import type { Language } from '@brickninja-org/database';
import type { TranslationSubset } from '@/lib/translate';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';

import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';

export interface LanguageDropdownProps {
  translations: TranslationSubset<
    | 'locale.formatting.settings'
    | 'language.select.label'
    | 'language.select.placeholder'
    | 'region.select.label'
    | 'region.select.placeholder'
  >;
}

const availableLanguages: Record<Language, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  nl: 'Nederlands',
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({ translations }) => {
  const { push } = useRouter();

  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);

  const currentLanguage = useLanguage();
  const currentLanguageLabel = availableLanguages[currentLanguage];

  // ✅ Type guards
  const isSettingsKey = (key: Key): key is 'settings' => key === 'settings';
  const isLanguageKey = (key: Key): key is Language =>
    typeof key === 'string' && Object.hasOwn(availableLanguages, key);

  const handleAction = useCallback((key: Key) => {
    if (isSettingsKey(key)) {
      setIsFormatDialogOpen(true);
      return;
    }

    if (isLanguageKey(key)) {
      const url = new URL(window.location.href);
      url.hostname = key + url.hostname.substring(2);
      push(url.href);
    }
    // Ignore unknown keys
  }, [push]);

  return (
    <>
      <Dropdown placement="bottom" radius="sm" shadow="md">
        <DropdownTrigger>
          <Button
            aria-label={currentLanguageLabel}
            className="min-w-10 w-10 md:min-w-20 md:w-fit"
            radius="sm"
            startContent={<Icon icon="globe"/>}
            variant="light"
          >
            <span className="hidden md:block">{currentLanguageLabel}</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={translations['language.select.label']}
          classNames={{
            base: 'rounded-sm'
          }}
          selectionMode="single"
          variant="flat"
          onAction={handleAction}
        >
          <DropdownSection
            showDivider
            title="Language"
            items={(Object.entries(availableLanguages) as [Language, string][])
              .map(([code, label]) => ({ key: code, label }))}
          >
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownSection>

          <DropdownSection title="Locale">
            <DropdownItem key="settings">
              {translations['locale.formatting.settings']}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <FormatConfigDialog
        translations={translations}
        open={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}/>
    </>
  );
};
