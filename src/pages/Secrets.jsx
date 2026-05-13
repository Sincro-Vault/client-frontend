import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, KeyRound, Eye, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { secretsService } from '../services/mockService';
import { SkeletonRow } from '../components/ui/Skeleton';
import ViewSecretModal from '../components/modals/ViewSecretModal';
import EditSecretModal from '../components/modals/EditSecretModal';
import DeleteSecretModal from '../components/modals/DeleteSecretModal';
import { toast } from '../components/ui/Toast';

const CATEGORY_COLORS = {
  api: 'text-sky-400 bg-sky-900/30 border-sky-700/30',
  database: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/30',
  certificate: 'text-amber-400 bg-amber-900/30 border-amber-700/30',
  password: 'text-rose-400 bg-rose-900/30 border-rose-700/30',
  token: 'text-indigo-400 bg-indigo-900/30 border-indigo-700/30',
  other: 'text-slate-400 bg-slate-900/30 border-slate-700/30',
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
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-prime)]">{t('secrets.title')}</h1>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">{total} {t('secrets.title').toLowerCase()}</p>
        </div>
        <Link to="/secrets/create" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-sm font-medium transition-all glow-electric">
          <Plus size={16} /><span className="hidden sm:inline">{t('secrets.createTitle')}</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t('common.search')}...`}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg text-sm appearance-none cursor-pointer min-w-[140px]">
            {categories.map(c => (
              <option key={c} value={c}>{c ? t(`secrets.categories.${c}`) : 'Todas'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl border border-[var(--border-dim)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-dim)] bg-[var(--bg-panel)]">
                {[t('secrets.name'), t('secrets.category'), t('secrets.status'), t('secrets.updatedAt'), ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              ) : secrets.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="py-16 text-center">
                      <ShieldOff size={32} className="mx-auto text-[var(--text-dim)] mb-3" />
                      <p className="text-[var(--text-muted)] font-medium">{t('secrets.noSecrets')}</p>
                      <p className="text-[var(--text-dim)] text-sm mt-1">{t('secrets.noSecretsDesc')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {secrets.map((secret, i) => (
                    <motion.tr key={secret.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-[var(--border-dim)] hover:bg-[var(--bg-panel)] transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)] flex items-center justify-center">
                            <KeyRound size={13} className="text-[var(--electric)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-prime)] font-mono">{secret.name}</p>
                            <p className="text-xs text-[var(--text-dim)] truncate max-w-[200px]">{secret.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${CATEGORY_COLORS[secret.category] || CATEGORY_COLORS.other}`}>
                          {t(`secrets.categories.${secret.category}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${secret.status === 'active' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <span className={`text-xs ${secret.status === 'active' ? 'text-emerald-400' : 'text-[var(--text-dim)]'}`}>
                            {t(`secrets.${secret.status}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-dim)] font-mono">
                        {new Date(secret.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewSecret(secret)}
                            className="p-1.5 rounded-lg hover:bg-sky-900/40 hover:text-sky-400 text-[var(--text-dim)] transition-colors" title={t('common.view')}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => setEditSecret(secret)}
                            className="p-1.5 rounded-lg hover:bg-amber-900/40 hover:text-amber-400 text-[var(--text-dim)] transition-colors" title={t('common.edit')}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteSecret(secret)}
                            className="p-1.5 rounded-lg hover:bg-red-900/40 hover:text-red-400 text-[var(--text-dim)] transition-colors" title={t('common.delete')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-dim)] bg-[var(--bg-panel)]">
            <span className="text-xs text-[var(--text-dim)]">Página {page} de {totalPages}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] disabled:opacity-40 hover:border-[var(--electric)] hover:text-[var(--electric)] transition-all">
                <ChevronLeft size={14} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] disabled:opacity-40 hover:border-[var(--electric)] hover:text-[var(--electric)] transition-all">
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
