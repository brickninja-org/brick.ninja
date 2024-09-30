export type Type = 'Book' | 'Container' | 'Gear' | 'Minifigure' | 'Set';
export type SubType<T extends Type> =
  T extends 'Container' ? 'Default' :
  T extends 'Book' ? 'Magazine' | 'Storybook' | 'Catalog' :
  T extends 'Gear' ? 'Key Chain' | 'Accessory' | 'Clothing' | 'Miscellaneous' :
  T extends 'Minifigure' ? null :
  T extends 'Set' ? 'Part' | 'Minifigure' | 'Instruction' | 'Package' :
  T extends 'Game' ? 'Board Game' | 'Video Game' :
  T extends 'Media' ? 'DVD' | 'Blu-ray' | 'VHS' | 'CD' | 'Cassette' | 'Digital' :
  never;

export type TypeWithSubtype = 'Container' | 'Set' | 'Book' | 'Gear';
export type TypeWithoutSubtype = Exclude<Type, TypeWithSubtype>;
