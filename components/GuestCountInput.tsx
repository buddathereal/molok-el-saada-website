import React, { useEffect, useState } from 'react';
import { clampGuestCount } from '../utils/order-utils.js';

export function GuestCountInput({ value, onChange, className, label }: { value: number; onChange: (value: number) => void; className: string; label: string }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  return <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    aria-label={label}
    value={draft}
    onChange={(event) => {
      const next = event.target.value;
      if (!/^\d*$/.test(next) || next.length > 6) return;
      setDraft(next);
      const count = Number(next);
      if (next && count >= 25 && count <= 1000) onChange(count);
    }}
    onBlur={() => {
      const next = clampGuestCount(draft);
      onChange(next);
      setDraft(String(next));
    }}
    className={className}
  />;
}
