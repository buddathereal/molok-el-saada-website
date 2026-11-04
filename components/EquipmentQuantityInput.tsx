import React, { useEffect, useState } from 'react';

/** Keeps an editable draft so deleting the current value doesn't immediately insert 1. */
export function EquipmentQuantityInput({ name, value, onChange, className }: {
  name: string;
  value: number;
  onChange: (value: number) => void;
  className: string;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => { setDraft(String(value)); }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      aria-label={`كمية ${name}`}
      value={draft}
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => {
        const next = event.target.value.replace(/[٠-٩۰-۹]/g, (digit) => {
          const code = digit.charCodeAt(0);
          return String(code >= 0x6f0 ? code - 0x6f0 : code - 0x660);
        });
        if (!/^\d*$/.test(next) || next.length > 9) return;
        setDraft(next);
        const quantity = Number(next);
        if (next && quantity > 0) onChange(quantity);
      }}
      onBlur={() => setDraft(String(value))}
      className={className}
    />
  );
}
