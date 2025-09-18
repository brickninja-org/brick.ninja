import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { Product as ApiProduct } from '@brickninjaapi/types/data/product';

import Link from 'next/link';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { localizedName } from '@/lib/localized-name';
import { translateMany } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { buttonVariants, ShareButton } from '@/components/button';
import { Iconify } from '@/components/iconify';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';

import { ProductLink } from './ProductLink';
import { RegionInfo } from './RegionInfo';
import { Translate } from '../i18n/Translate';

interface ProductInfoboxProps {
  product: Product,
  data: ApiProduct,
  language: Language,
}

export const ProductInfobox: FC<ProductInfoboxProps> = async ({ product, data, language }) => {
  const currentUrl = await getCurrentUrl();

  const regionInfoTranslations = translateMany(['regionInfo.rrp', 'regionInfo.ppp', 'regionInfo.release.date', 'regionInfo.discontinuation.date', 'regionInfo.points'], language);

  return (
    <div>
      <LanguageLinks link={<ProductLink product={product} icon="none"/>} language={language}/>

      <Headline id="region-info" noToc><Translate id="regionInfo.title"/></Headline>
      <RegionInfo data={data} translations={regionInfoTranslations}/>

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        {product.type === 'Set' && (
          <Link
            className={buttonVariants({ variant: 'tertiary', className: 'flex-1 rounded-sm' })}
            href={`https://www.lego.com/pick-and-build/pick-a-brick?appearsIn=${product.id}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Iconify icon="arrow-up-right-from-square"/>
            Pick a Brick
          </Link>
        )}
        <Link
          className={buttonVariants({ variant: 'tertiary', className: 'flex-1 rounded-sm' })}
          href={`https://www.lego.com/product/${product.id}`}
          rel="noopener noreferrer"
          target="product"
        >
          <Iconify icon="arrow-up-right-from-square"/>
          LEGO.com
        </Link>
        <ShareButton className="flex-1 rounded-sm" variant="tertiary" data={{ title: localizedName(product, language), url: currentUrl.toString() }}/>
      </FlexRow>
    </div>
  );
};
