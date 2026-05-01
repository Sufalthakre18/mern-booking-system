import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/index.js';
import ExpertCard from '../components/ExpertCard.jsx';

const CATEGORIES = ['Technology', 'Finance', 'Health', 'Legal', 'Marketing'];

// Reusable input style using CSS vars
const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
};

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getExperts({ page, limit: 6, search, category });
      setExperts(data.experts);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
          Find an Expert
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-3)' }}>
          Book a private session with a verified professional
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ ...inputStyle, boxShadow: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--sage)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--sage)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-xs mb-5" style={{ color: 'var(--text-3)' }}>
          {total} expert{total !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 animate-pulse h-52"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full" style={{ background: 'var(--border)' }} />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 rounded w-2/3" style={{ background: 'var(--border)' }} />
                  <div className="h-3 rounded w-1/3" style={{ background: 'var(--border-soft)' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded" style={{ background: 'var(--border-soft)' }} />
                <div className="h-3 rounded w-5/6" style={{ background: 'var(--border-soft)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'var(--red-soft)', color: 'var(--red)', border: '1px solid #f0d0d0' }}
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && experts.length === 0 && (
        <div className="text-center py-24" style={{ color: 'var(--text-3)' }}>
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium">No experts found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && experts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experts.map((expert) => <ExpertCard key={expert._id} expert={expert} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm disabled:opacity-30"
            style={{ border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            ← Prev
          </button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className="w-9 h-9 rounded-lg text-sm font-medium"
              style={
                page === i + 1
                  ? { background: 'var(--sage)', color: '#fff' }
                  : { border: '1px solid var(--border)', color: 'var(--text-2)' }
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg text-sm disabled:opacity-30"
            style={{ border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}