
export interface MenuItem {
  name: string;
  items: string[];
}

export interface MenuPackage {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  perPerson?: boolean;
  minPeople?: number;
  fixedCount?: number;
  note?: string;
  sections: MenuItem[];
  isRecommended?: boolean;
}

export interface EquipmentOption {
  id: string;
  name: string;
  price: number;
}

export interface EquipmentItem {
  id: string;
  image?: string;
  images?: string[];
  name?: string;
  price?: number;
  note?: string;
  options?: EquipmentOption[];
}

export interface EquipmentSection {
  title?: string;
  items: EquipmentItem[];
  displayOnly?: boolean;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items?: EquipmentItem[];
  sections?: EquipmentSection[];
  extraInfo?: string[];
  quickSelections?: EquipmentOption[];
  displayMode?: 'grid' | 'cards';
}
