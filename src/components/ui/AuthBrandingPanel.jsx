import { motion } from 'framer-motion';
import {
  ShieldCheck, KeySquare, MapPin, Activity, Cpu, Sparkles,
} from 'lucide-react';

export default function AuthBrandingPanel() {
  const features = [
    { icon: KeySquare, title: 'Shamir Secret Sharing',
      desc: 'Cada secreto se divide en fragmentos. Ningún nodo tiene la clave completa.' },
    { icon: Cpu, title: 'AES-256-GCM',
      desc: 'Cifrado autenticado en reposo con nonce único por operación.' },
    { icon: MapPin, title: 'Geofencing GPS + IP',
      desc: 'Acceso bloqueado fuera del perímetro autorizado de la oficina.' },
    { icon: Activity, title: 'Blockchain Audit Ledger',
      desc: 'Cada acceso queda en una cadena inmutable con proof-of-work.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '100vh',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(16,185,129,0.10) 100%)',
        borderRight: '1px solid var(--border-dim)',
      }}
    >
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: -128, left: -128, width: 384, height: 384,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: -128, right: -128, width: 448, height: 448,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 16, opacity: 0.6,
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)', filter: 'blur(8px)',
            }} />
            <div style={{
              position: 'relative', width: 48, height: 48, borderRadius: 16,
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            }}>
              <ShieldCheck size={24} color="white" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-prime)', letterSpacing: '-0.02em' }}>SecureSplit Vault</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Enterprise Credential Mgmt
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
          }}>
            <Sparkles size={11} color="#34d399" />
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399' }}>
              Zero-trust architecture
            </span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-prime)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
            Tus credenciales,<br />
            <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              fragmentadas y geo-cercadas.
            </span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6, maxWidth: 480 }}>
            Sistema distribuido de gestión de secretos con fragmentación criptográfica entre cliente y servidor,
            validación geográfica y auditoría blockchain inmutable.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <div style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 8,
                background: 'rgba(13,31,60,0.6)',
                border: '1px solid var(--border-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <f.icon size={15} color="#0ea5e9" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-prime)', margin: 0 }}>{f.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2, maxWidth: 320, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 12,
          paddingTop: 24, borderTop: '1px solid var(--border-dim)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={12} color="#34d399" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            JWT · RSA-2048 · TLS 1.3 · SHAMIR
          </span>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          Trusted by Aldeamo S.A.S · Bogotá D.C.
        </p>
      </motion.div>
    </motion.div>
  );
}
