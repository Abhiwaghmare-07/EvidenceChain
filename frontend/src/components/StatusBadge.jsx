import React from 'react';
import { CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

export default function StatusBadge({ isTampered, label }) {
  if (isTampered === true) {
    return (
      <span className="badge badge-tampered">
        <AlertOctagon size={13} />
        {label || 'TAMPERED'}
      </span>
    );
  }

  if (isTampered === false) {
    return (
      <span className="badge badge-verified">
        <CheckCircle2 size={13} />
        {label || 'VERIFIED'}
      </span>
    );
  }

  return (
    <span className="badge badge-neutral">
      <HelpCircle size={13} />
      {label || 'UNVERIFIED'}
    </span>
  );
}
