
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
}

export interface EquipmentItem {
  id: string;
  image: string;
  name?: string;
  price?: number;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: EquipmentItem[];
}
