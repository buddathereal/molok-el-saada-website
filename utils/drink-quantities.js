// Preserve explicitly customized amounts when the guest count changes.
export function syncDrinkQuantities(quantities, selectedDrinks, manualDrinks, guestCount) {
  const manual = new Set(manualDrinks);
  const next = { ...quantities };
  for (const name of selectedDrinks) {
    if (!manual.has(name)) next[name] = guestCount;
  }
  return next;
}
