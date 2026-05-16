import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, KeyRound, Eye, Pencil, Trash2, Plus,
  ChevronLeft, ChevronRight, ShieldOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { secretsService } from '../services/mockService';
import { SkeletonRow } from '../components/ui/Skeleton';
import ViewSecretModal from '../components/modals/ViewSecretModal';
import EditSecretModal from '../components/modals/EditSecretModal';
import DeleteSecretModal from '../components/modals/DeleteSecretModal';
import { toast } from '../components/ui/Toast';

const CATEGORY_COLORS = {
  api: { fg: '#38bdf8', bg: 'rgba(8,47,73,0.5)', bd: 'rgba(56,189,248,0.3)' },
  database: { fg: '#34d399', bg: 'rgba(6,78,59,0.5)', bd: 'rgba(52,211,153,0.3)' },
  certificate: { fg: '#fbbf24', bg: 'rgba(120,53,15,0.5)', bd: 'rgba(251,191,36,0.3)' },
  password: { fg: '#fb7185', bg: 'rgba(136,19,55,0.5)', bd: 'rgba(251,113,133,0.3)' },
  token: { fg: '#a5b4fc', bg: 'rgba(49,46,129,0.5)', bd: 'rgba(165,180,252,0.3)' },
  other: { fg: '#94a3b8', bg: 'rgba(30,41,59,0.5)', bd: 'rgba(148,163,184,0.3)' },
};

const inputBaseStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--bg-panel)',
  border: '1px solid var(--border-dim)',
  borderRadius: 8,
  color: 'var(--text-prime)',
  fontSize: 13,
  outline: 'none',
};

export default function Secrets() {
  const { t } = useTranslation();
  const [secrets, setSecrets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewSecret, setViewSecret] = useState(null);
  const [editSecret, setEditSecret] = useState(null);
  const [deleteSecret, setDeleteSecret] = useState(null);

  const fetchSecrets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await secretsService.getAll({ search, page, limit: 8, category });
      setSecrets(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [search, page, category]);

  useEffect(() => { fetchSecrets(); }, [fetchSecrets]);
  useEffect(() => { setPage(1); }, [search, category]);

  const handleDelete = async (id) => {
    await secretsService.delete(id);
    toast.success(t('secrets.deleteSuccess'));
    setDeleteSecret(null);
    fetchSecrets();
  };

  const handleEdit = async (id, data) => {
    await secretsService.update(id, data);
    toast.success(t('secrets.updateSuccess'));
    setEditSecret(null);
    fetchSecrets();
  };

  const categories = ['', 'api', 'database', 'certificate', 'password', 'token', 'other'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1280 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-prime)', letterSpacing: '-0.02em', margin: 0 }}>
            {t('secrets.title')}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
            {total} {t('secrets.title').toLowerCase()}
          </p>
        </div>
        <Link
          to="/secrets/create"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 8,
            background: 'linear-gradient(90deg, #0284c7, #0ea5e9)',
            color: 'white', fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 4px 12px -2px rgba(2,132,199,0.4)',
          }}
        >
          <Plus size={16} />{t('secrets.createTitle')}
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-dim)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t('common.search')}...`}
            style={{ ...inputBaseStyle, paddingLeft: 36 }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Filter size={14} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-dim)', pointerEvents: 'none',
          }} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              ...inputBaseStyle, paddingLeft: 36, paddingRight: 32,
              minWidth: 160, cursor: 'pointer', appearance: 'none',
            }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c ? t(`secrets.categories.${c}`) : 'Todas'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{
        borderRadius: 12,
        border: '1px solid var(--border-dim)',
        background: 'rgba(13,31,60,0.6)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dim)', background: 'var(--bg-panel)' }}>
                {[t('secrets.name'), t('secrets.category'), t('secrets.status'), t('secrets.updatedAt'), ''].map((h, i) => (
                  <th key={i} style={{
                    textAlign: 'left', padding: '12px 16px',
                    fontSize: 10, fontWeight: 500,
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              ) : secrets.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                      <ShieldOff size={32} style={{ display: 'inline-block', color: 'var(--text-dim)', marginBottom: 12 }} />
                      <p style={{ color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>{t('secrets.noSecrets')}</p>
                      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{t('secrets.noSecretsDesc')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {secrets.map((secret, i) => {
                    const c = CATEGORY_COLORS[secret.category] || CATEGORY_COLORS.other;
                    return (
                      <motion.tr
                        key={secret.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="row-hover"
                        style={{ borderBottom: '1px solid var(--border-dim)', transition: 'background 0.15s' }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8,
                              background: 'var(--bg-panel)',
                              border: '1px solid var(--border-dim)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <KeyRound size={13} color="#0ea5e9" />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-prime)', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>{secret.name}</p>
                              {secret.description && (
                                <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: 0, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {secret.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '2px 8px', borderRadius: 6,
                            fontSize: 11, fontWeight: 500,
                            background: c.bg, border: `1px solid ${c.bd}`, color: c.fg,
                          }}>
                            {t(`secrets.categories.${secret.category}`)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: secret.status === 'active' ? '#34d399' : '#475569',
                            }} />
                            <span style={{
                              fontSize: 12,
                              color: secret.status === 'active' ? '#34d399' : 'var(--text-dim)',
                            }}>
                              {t(`secrets.${secret.status}`)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {new Date(secret.updatedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => setViewSecret(secret)}
                              title={t('common.view')}
                              style={iconBtnStyle('#38bdf8')}>
                              <Eye size={14} />
                            </button>
                            <button onClick={() => setEditSecret(secret)}
                              title={t('common.edit')}
                              style={iconBtnStyle('#fbbf24')}>
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteSecret(secret)}
                              title={t('common.delete')}
                              style={iconBtnStyle('#f87171')}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: '1px solid var(--border-dim)',
            background: 'var(--bg-panel)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Página {page} de {totalPages}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={pagerBtnStyle(page <= 1)}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={pagerBtnStyle(page >= totalPages)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewSecret && <ViewSecretModal secret={viewSecret} onClose={() => setViewSecret(null)} />}
      {editSecret && <EditSecretModal secret={editSecret} onClose={() => setEditSecret(null)} onSave={handleEdit} />}
      {deleteSecret && <DeleteSecretModal secret={deleteSecret} onClose={() => setDeleteSecret(null)} onConfirm={() => handleDelete(deleteSecret.id)} />}
    </div>
  );
}

function iconBtnStyle(hoverColor) {
  return {
    padding: 6, borderRadius: 6,
    background: 'transparent', border: 0,
    color: 'var(--text-dim)', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  };
}

function pagerBtnStyle(disabled) {
  return {
    padding: 6, borderRadius: 6,
    background: 'transparent',
    border: '1px solid var(--border-dim)',
    color: disabled ? 'var(--text-dim)' : 'var(--text-muted)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}
