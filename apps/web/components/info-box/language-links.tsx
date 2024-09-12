import { cloneElement, type FC, type ReactElement } from 'react';

import type { Language } from '@brickninja-org/database';

interface LanguageLinksProps {
  link: ReactElement<{ language: string }>;
  language: Language;
}

export const LanguageLinks: FC<LanguageLinksProps> = ({ link, language }) => {
  return (
    <div className="grid grid-cols-2 items-base gap-[0px_8px]">
      {language !== 'en' && (<><div className="text-gray-600">EN</div>{cloneElement(link, { language: 'en' })}</>)}
      {language !== 'nl' && (<><div className="text-gray-600">NL</div>{cloneElement(link, { language: 'nl' })}</>)}
    </div>
  );
};
