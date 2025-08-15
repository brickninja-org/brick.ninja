import type { FC } from 'react';

import { useMemo } from 'react';
import { Select, SelectItem } from '@heroui/react';

import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
// import { Label } from '@brickninja-org/ui/components/form/Label';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
// import { Select } from '@brickninja-org/ui/components/form/Select';

import { useFormatContext } from '@/components/format/Format.context';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { useLanguage } from '@/components/i18n/context';
import { CookieNotification } from '@/components/user/CookieNotification';

export interface FormatConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultLocales = { languages: ['de', 'en', 'es', 'fr', 'nl'], regions: ['BE', 'CA', 'DE', 'ES', 'FR', 'GB', 'NL', 'US'] };
const localeRegex = /^([a-z]{2,4})([_-][a-z]{4})?[_-]([a-z]{2,3})?/i;

const { languages: availableLanguages, regions: availableRegions } = typeof window === 'undefined'
  ? defaultLocales
  : navigator.languages.reduceRight((available, lang) => {
    const match = lang.match(localeRegex);

    if(!match) {
      return available;
    }

    if(match[3]) {
      return {
        languages: [match[1], ...available.languages.filter((l) => l !== match[1])],
        regions: [match[3], ...available.regions.filter((r) => r !== match[3])]
      };
    }

    return { ...available, languages: [match[1], ...available.languages.filter((l) => l !== match[1])] };
  }, defaultLocales);

export const FormatConfigDialog: FC<FormatConfigDialogProps> = ({ open, onClose }) => {
  const { locale, language, region, setLocale, defaultRegion, currency } = useFormatContext();
  const currentLanguage = useLanguage();

  const languages = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'language' });

    return availableLanguages.map((lang) => ({ value: lang, label: `${formatter.of(lang)} (${lang})` }));
  }, [currentLanguage]);

  const regions = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'region' });

    return availableRegions.map((region) => ({ value: region, label: `${formatter.of(region)} (${region})` }));
  }, [currentLanguage]);

  return (
    <Dialog title="Formatting Settings" onClose={onClose} open={open}>
      <div className="flex flex-col gap-4">
        <CookieNotification/>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            items={[{ label: `Current language (${currentLanguage})`, value: 'auto' }, ...languages]}
            selectedKeys={[language]}
            label="Language"
            placeholder="Select a language"
            radius="sm"
            variant="bordered"
            className="max-w-xs"
            onChange={(e) => setLocale(e.target.value, region)}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>

          <div className="hidden sm:block mt-6 leading-9">-</div>

          <Select
            items={[{ label: `Browser region (${defaultRegion})`, value: 'browser' }, ...regions]}
            selectedKeys={[region]}
            label="Region"
            placeholder="Select a region"
            radius="sm"
            variant="bordered"
            className="max-w-xs"
            onChange={(e) => setLocale(language, e.target.value)}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>

        <div className="p-4 rounded-xs border bg-(--color-background-light) border-(--color-border-dark)">
          <MenuList>
            <div className="flex justify-between py-0.5 px-2">Locale <span>{locale}</span></div>
            <div className="flex justify-between py-0.5 px-2">Date <FormatDate date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Relative Date <FormatDate relative date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Number <span><FormatNumber value={123456.89}/></span></div>
            <div className="flex justify-between py-0.5 px-2">Currency <span><FormatNumber value={123456.89} options={{ style: 'currency', currency }}/></span></div>
          </MenuList>
        </div>
      </div>
    </Dialog>
  );
};
