import 'server-only';

import type { Language } from '@brickninja-org/database';

import { headers } from 'next/headers';

export function getLanguage() {
  const language = headers().get('x-bn-lang') as Language;

  return language;
}
