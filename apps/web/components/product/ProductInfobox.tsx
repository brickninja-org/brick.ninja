import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { Product as ApiProduct } from '@brickninjaapi/types/data/product';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { localizedName } from '@/lib/localized-name';
import { translateMany } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';
import { ShareButton } from '@/components/share-button/ShareButton';

import { ProductLink } from './ProductLink';
import { RegionInfo } from './RegionInfo';
import { Translate } from '../i18n/Translate';

interface ProductInfoboxProps {
  product: Product;
  data: ApiProduct;
  language: Language;
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
        {product.type === 'Set' && <LinkButton appearance="tertiary" flex icon="external" external href={`https://www.lego.com/pick-and-build/pick-a-brick?appearsIn=${product.id}`} target="_blank">Pick a Brick</LinkButton>}
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://www.lego.com/product/${product.id}`} target="product">LEGO.com</LinkButton>
        <ShareButton radius="sm" variant="ghost" flex data={{ title: localizedName(product, language), url: currentUrl.toString() }}/>
      </FlexRow>
    </div>
  );
};
