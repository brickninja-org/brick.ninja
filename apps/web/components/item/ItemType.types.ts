export type Type = 'Container' | 'Documentation' | 'Element' | 'Minifigure' | 'Packaging' | 'Product' | 'Book' | 'Set';
export type SubType<T extends Type> =
  T extends 'Container' ? 'Default' :
  T extends 'Documentation' ? 'Instruction' :
  T extends 'Element' ? 'DUPLO' | 'LEGO' | 'TECHNIC' :
  T extends 'Packaging' ? 'Bag' :
  T extends 'Product' ? 'Set' :
  never;

export type TypeWithSubtype = 'Container' | 'Documentation' | 'Element' | 'Minifigure' | 'Packaging' | 'Product';
export type TypeWithoutSubtype = Exclude<Type, TypeWithSubtype>;
