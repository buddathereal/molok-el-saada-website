import { BEVERAGES_MENU, EQUIPMENT_DATA, SERVICE_SECTIONS, SOFT_DRINKS } from '../data';
import { clampGuestCount, normalizeQuantity } from './order-utils.js';

// Only cart selections are stored locally; customer details and transient inquiry state are never persisted.
export const CART_STORAGE_KEY = 'molok-cart-v1';
const equipmentIds = new Set(EQUIPMENT_DATA.flatMap(cat => [
  ...(cat.quickSelections ?? []).map(item => item.id),
  ...[...(cat.items ?? []), ...(cat.sections ?? []).flatMap(section => section.items)].flatMap(item => [item.id, ...(item.options ?? []).map(option => option.id)])
]));
const serviceNames = new Set(SERVICE_SECTIONS.flatMap(section => section.items));
const beverageNames = new Set(BEVERAGES_MENU.filter(pkg => !pkg.perPerson).flatMap(pkg => pkg.sections.flatMap(section => section.items)));
const drinkNames = new Set(SOFT_DRINKS.map(item => item.name));
const safeSelection = (value: unknown, valid: Set<string>): string[] =>
  Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && valid.has(item)))] : [];
const safeQuantities = (value: unknown, valid: Set<string>): Record<string, number> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, quantity]) => valid.has(key) && typeof quantity === 'number' && Number.isFinite(quantity) && quantity > 0).map(([key, quantity]) => [key, Math.min(10000, normalizeQuantity(quantity))]));
};
export const readCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1) return null;
    return {
      calcPax: clampGuestCount(raw.calcPax),
      selectedPkgId: BEVERAGES_MENU.some(pkg => pkg.id === raw.selectedPkgId) ? raw.selectedPkgId as string : '',
      selectedExtraServices: safeSelection(raw.selectedExtraServices, serviceNames),
      selectedDrinks: safeSelection(raw.selectedDrinks, drinkNames),
      drinkQuantities: safeQuantities(raw.drinkQuantities, drinkNames),
      manualDrinkQuantities: safeSelection(Array.isArray(raw.manualDrinkQuantities) ? raw.manualDrinkQuantities : raw.selectedDrinks, drinkNames).filter(name => safeSelection(raw.selectedDrinks, drinkNames).includes(name)),
      selectedBeverages: safeSelection(raw.selectedBeverages, beverageNames),
      beverageQuantities: safeQuantities(raw.beverageQuantities, beverageNames),
      selectedEquipment: safeSelection(raw.selectedEquipment, equipmentIds),
      equipmentQuantities: safeQuantities(raw.equipmentQuantities, equipmentIds),
      serviceQuantities: safeQuantities(raw.serviceQuantities, serviceNames)
    };
  } catch { return null; }
};

