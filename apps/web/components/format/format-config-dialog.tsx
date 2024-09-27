import { useMemo, type FC } from 'react';

import { Dialog } from '@brickninja-org/ui/components/dialog';
import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { Label } from '@brickninja-org/ui/components/form/label';
import { MenuList } from '@brickninja-org/ui/components/layout/menu-list';
import { Select } from '@brickninja-org/ui/components/form/select';

import { useFormatContext } from '@/components/format/format-context';
import { FormatCurrency } from '@/components/format/format-currency';
import { FormatDate } from '@/components/format/format-date';
import { FormatNumber } from '@/components/format/format-number';
import { useLanguage } from '@/components/i18n/context';
import { useUser } from '@/components/user/use-user';

export interface FormatConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultLocales = { languages: ['en', 'nl'], regions: ['BE', 'CA', 'DE', 'GB', 'NL', 'US'] };
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
  const { locale, language, region, setLocale, defaultRegion } = useFormatContext();
  const currentLanguage = useLanguage();

  const languages = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'language' });

    return availableLanguages.map((lang) => ({ value: lang, label: `${formatter.of(lang)} (${lang})` }));
  }, [currentLanguage]);

  const regions = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'region' });

    return availableRegions.map((region) => ({ value: region, label: `${formatter.of(region)} (${region})` }));
  }, [currentLanguage]);

  const { user } = useUser();

  return (
    <Dialog title="Formatting Settings" onClose={onClose} open={open}>
      <div className="flex flex-col gap-4">
        {!user && (
          <div className="p-4 rounded-sm border bg-gray-100">
            <FlexRow>Changing your settings will store cookies in your browser.</FlexRow>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Label label="language">
            <Select options={[{ label: `Current language (${currentLanguage})`, value: 'auto' }, ...languages]} value={language} onChange={(language) => setLocale(language, region)}/>
          </Label>
          <div className="hidden sm:block mt-6 leading-9">-</div>
          <Label label="region">
            <Select options={[{ label: `Browser region (${defaultRegion})`, value: 'browser' }, ...regions]} value={region} onChange={(region) => setLocale(language, region)}/>
          </Label>
        </div>

        <div className="p-4 rounded-sm border bg-gray-100">
          <MenuList>
            <div className="flex justify-between py-0.5 px-2">Locale <span>{locale}</span></div>
            <div className="flex justify-between py-0.5 px-2">Date <FormatDate date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Relative Date <FormatDate relative date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Number <span><FormatNumber value={123456.89}/></span></div>
            <div className="flex justify-between py-0.5 px-2">Currency <span><FormatCurrency value={123456.89}/></span></div>
          </MenuList>
        </div>
      </div>
    </Dialog>
  );
};
