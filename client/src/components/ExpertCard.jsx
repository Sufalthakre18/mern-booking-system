import { Link } from 'react-router-dom';

const CATEGORY_STYLES = {
  Technology: { bg: '#edf3f5', color: '#3d6e80' },
  Finance:    { bg: '#f0f5ed', color: '#4e7a45' },
  Health:     { bg: '#f5edee', color: '#7a4a4d' },
  Legal:      { bg: '#f5f2ed', color: '#7a6340' },
  Marketing:  { bg: '#f0edf5', color: '#5a4a7a' },
};

export default function ExpertCard({ expert }) {
  const cat = CATEGORY_STYLES[expert.category] || { bg: '#f0eeec', color: '#5a534e' };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`}
          alt={expert.name}
          className="w-13 h-13 rounded-full"
          style={{ border: '2px solid var(--border-soft)', background: 'var(--bg)' }}
        />
        <div>
          <h3
            className="font-semibold text-base leading-snug"
            style={{ color: 'var(--text)' }}
          >
            {expert.name}
          </h3>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ background: cat.bg, color: cat.color }}
          >
            {expert.category}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm" style={{ color: 'var(--text-3)' }}>
        <span>★ {expert.rating.toFixed(1)}</span>
        <span>{expert.experience} yrs exp</span>
      </div>

      {expert.bio && (
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-2)' }}>
          {expert.bio}
        </p>
      )}

      <Link
        to={`/experts/${expert._id}`}
        className="mt-auto block text-center text-sm font-medium py-2.5 rounded-xl"
        style={{ background: 'var(--sage-soft)', color: 'var(--sage)' }}
        onMouseEnter={e => { e.target.style.background = 'var(--sage)'; e.target.style.color = '#fff'; }}
        onMouseLeave={e => { e.target.style.background = 'var(--sage-soft)'; e.target.style.color = 'var(--sage)'; }}
      >
        View Profile →
      </Link>
    </div>
  );
}