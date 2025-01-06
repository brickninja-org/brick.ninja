import 'server-only';

import type { FC } from 'react';

import type { Language } from '@brickninja-org/database';

import { getLanguage, translate, type TranslationId } from '@/lib/translate';

export interface TranslateProps {
  id: TranslationId;
  language?: Language;
}

export const Translate: FC<TranslateProps> = async ({ id, language }) => {
  language ??= await getLanguage();
  const translation = await translate(id, language);

  return <>{translation}</>;
};
