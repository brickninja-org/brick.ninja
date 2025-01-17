export type Type = 'Book' | 'Gear' | 'Minifigure' | 'Set';
export type SubType<T extends Type> =
  T extends 'Book' ? 'Magazine' :
  T extends 'Gear' ? 'Key Chain' :
  T extends 'Minifigure' ? null :
  T extends 'Set' ? null :
  never;

export type TypeWithSubtype = 'Book' | 'Gear';
export type TypeWithoutSubtype = Exclude<Type, TypeWithSubtype>;
