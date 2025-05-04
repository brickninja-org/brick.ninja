import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { Product as ApiProduct } from 'types/product';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { localizedName } from '@/lib/localized-name';
import { getCurrentUrl } from '@/lib/url';
import { DataList } from '@/components/info-box/DataList';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';
import { ShareButton } from '@/components/share-button/ShareButton';

import { ProductLink } from './ProductLink';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

interface ProductInfoboxProps {
  product: Product;
  data: ApiProduct;
  language: Language;
}

export const ProductInfobox: FC<ProductInfoboxProps> = async ({ product, data, language }) => {
  const currentUrl = await getCurrentUrl();

  return (
    <div>
      <LanguageLinks link={<ProductLink product={product} icon="none"/>} language={language}/>

      <Headline id="info" noToc>Info</Headline>
      <DataList data={[
        data.type && { key: 'type', label: 'Type', value: data.type },
      ]}/>

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://www.lego.com/product/${product.id}`} target="product">LEGO.com</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(product, language), url: currentUrl.toString() }}/>
      </FlexRow>
    </div>
  );
};
