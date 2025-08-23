import type { Metadata } from 'next';
import type { LayoutProps, PageProps } from './next';
import { getAlternateUrls, getCurrentUrl } from './url';
import type { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';
import { getLanguage } from './translate';

export function createMetadata<Props extends PageProps | LayoutProps>(getMeta: ((props: Props) => Promise<Meta> | Meta) | Meta) {
  return async (props: Props): Promise<Metadata> => {
    const meta = typeof getMeta === 'function' ? await getMeta(props) : getMeta;
    const language = await getLanguage();

    const url = await getCurrentUrl();
    const alternates = getAlternateUrls(meta.url ?? url.pathname, language);

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates,
      robots: meta.robots,
    };
  };
}

type Meta = {
  title: string | TemplateString;
  description?: string;
  keywords?: string[];
  url?: string;
  robots?: Metadata['robots'];
};
