import React, { useEffect, useState } from 'react';
import { normalizeQuantity } from '../utils/order-utils.js';

export function DrinkQuantityInput({ name, value, onChange }: { name: string; value: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      aria-label={`كمية ${name}`}
      value={draft}
      onChange={(event) => {
        const next = event.target.value;
        if (!/^\d*$/.test(next)) return;
        setDraft(next);
        if (next && Number(next) > 0) onChange(normalizeQuantity(next));
      }}
      onBlur={() => setDraft(String(value))}
      className="w-16 h-11 rounded-xl border border-white/20 bg-white/5 text-white font-bold font-numbers text-center focus:border-royal-gold outline-none"
    />
  );
}
