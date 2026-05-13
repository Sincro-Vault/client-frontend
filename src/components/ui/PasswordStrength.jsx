import { useMemo } from 'react';

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Débil', color: '#ef4444', pct: 20 };
  if (score <= 3) return { score, label: 'Regular', color: '#f59e0b', pct: 40 };
  if (score <= 4) return { score, label: 'Buena', color: '#0ea5e9', pct: 65 };
  if (score <= 5) return { score, label: 'Fuerte', color: '#10b981', pct: 85 };
  return { score, label: 'Muy fuerte', color: '#10b981', pct: 100 };
};

const checks = [
  { label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Mayúsculas (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Minúsculas (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'Números (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'Caracteres especiales', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)]">Fortaleza</span>
        <span style={{ color: strength.color }} className="font-medium">{strength.label}</span>
      </div>
      <div className="h-1 w-full bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${strength.pct}%`, backgroundColor: strength.color }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${c.test(password) ? 'bg-emerald-400' : 'bg-[var(--border-bright)]'}`} />
            <span className={c.test(password) ? 'text-emerald-400' : 'text-[var(--text-dim)]'}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
