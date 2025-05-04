export type Type = 'Container' | 'Element' | 'Minifigure' | 'Product' | 'Book' | 'Set';
export type SubType<T extends Type> =
  T extends 'Container' ? 'Default' :
  T extends 'Element' ? 'AnimalCreature' | 'Brick' | 'BrickBowArch' | 'BrickModified' | 'BrickModifiedBowArch' | 'BrickRoundAngle' | 'CableHose' | 'Connector' | 'DecorationElement' | 'FoodDrink' | 'FunctionalElement' | 'MinifigureHandheldAccessory' | 'MinifigureToolAccessory' | 'MiscellaneousElement' | 'Plate' | 'PlateModified' | 'PlateRoundAngle' | 'SignFlagPole' | 'TreePlant' | 'VehiclePart' | 'WindowWallDoor' :
  T extends 'Product' ? 'Instruction' :
  never;

export type TypeWithSubtype = 'Container' | 'Element' | 'Minifigure' | 'Product';
export type TypeWithoutSubtype = Exclude<Type, TypeWithSubtype>;
