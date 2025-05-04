export interface Item {
  id: number;
  type: 'Container' | 'Element';
  icon?: string;
  name: string;
  description?: string;
  flags: string[];
  details?: {
    type?: 'Hair' | 'Head' | 'Torso';
    color_id?: number;
    design_id?: number;
    max_age?: number;
    min_age?: number;
    piece_type?: 'Duplo' | 'Lego' | 'Technic'; 
  };
  default_product?: number;
}

export type Attribute = 'PieceCount' | 'MinifigureCount' ;
