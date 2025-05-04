export interface Product {
  id: number;
  type: 'Product';
  icon?: string;
  itemIds: number[];
  name: string;
  details: {
    type?: string;
    attributes?: {
      [key: string]: string;
    }[];
  };
}
