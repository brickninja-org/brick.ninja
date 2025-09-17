import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { Product as ApiProduct } from '@brickninjaapi/types/data/product';

import { Button, Link } from '@heroui/react';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { localizedName } from '@/lib/localized-name';
import { translateMany } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';
import { ShareButton } from '@/components/button';

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
          <Button
            isExternal
            as={Link}
            className="flex-1"
            href={`https://www.lego.com/pick-and-build/pick-a-brick?appearsIn=${product.id}`}
            radius="sm"
            variant="ghost"
          >
            Pick a Brick
          </Button>
        )}
        <Button
          isExternal
          as={Link}
          className="flex-1"
          href={`https://www.lego.com/product/${product.id}`}
          radius="sm"
          target="product"
          variant="ghost"
        >
          LEGO.com
        </Button>
        <ShareButton className="flex-1 rounded-sm" variant="tertiary" data={{ title: localizedName(product, language), url: currentUrl.toString() }}/>
      </FlexRow>
    </div>
  );
};
