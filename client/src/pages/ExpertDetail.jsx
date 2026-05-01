import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/index.js';
import { useSocket } from '../context/SocketContext.jsx';

const CATEGORY_STYLES = {
  Technology: { bg: '#edf3f5', color: '#3d6e80' },
  Finance:    { bg: '#f0f5ed', color: '#4e7a45' },
  Health:     { bg: '#f5edee', color: '#7a4a4d' },
  Legal:      { bg: '#f5f2ed', color: '#7a6340' },
  Marketing:  { bg: '#f0edf5', color: '#5a4a7a' },
};

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const data = await api.getExpert(id);
        setExpert(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  // Real-time slot updates via Socket.io
  useEffect(() => {
    if (!socket) return;
    const handler = ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;
      setBookedSlots((prev) => {
        const updated = { ...prev };
        if (!updated[date]) updated[date] = new Set();
        else updated[date] = new Set(updated[date]);
        updated[date].add(timeSlot);
        return updated;
      });
    };
    socket.on('slotBooked', handler);
    return () => socket.off('slotBooked', handler);
  }, [socket, id]);

  const handleBook = (date, time) => {
    navigate(`/book/${id}?date=${date}&time=${encodeURIComponent(time)}`);
  };

  const isBooked = (date, time) => bookedSlots[date]?.has(time);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="rounded-2xl p-6 flex gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-20 h-20 rounded-full" style={{ background: 'var(--border)' }} />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-5 rounded w-1/3" style={{ background: 'var(--border)' }} />
            <div className="h-3 rounded w-1/4" style={{ background: 'var(--border-soft)' }} />
            <div className="h-3 rounded w-full" style={{ background: 'var(--border-soft)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
      {error}
    </div>
  );

  if (!expert) return null;

  const cat = CATEGORY_STYLES[expert.category] || { bg: '#f0eeec', color: '#5a534e' };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm flex items-center gap-1"
        style={{ color: 'var(--text-3)' }}
      >
        ← Back to Experts
      </button>

      {/* Profile card */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row gap-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <img
          src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`}
          alt={expert.name}
          className="w-20 h-20 rounded-full self-start"
          style={{ border: '2px solid var(--border)' }}
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              {expert.name}
            </h1>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: cat.bg, color: cat.color }}
            >
              {expert.category}
            </span>
          </div>
          <div className="flex gap-4 text-sm mb-3" style={{ color: 'var(--text-3)' }}>
            <span>★ {expert.rating.toFixed(1)}</span>
            <span>{expert.experience} years experience</span>
          </div>
          {expert.bio && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {expert.bio}
            </p>
          )}
        </div>
      </div>

      {/* Available slots */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          Available Sessions
        </h2>

        {!expert.availableSlots || expert.availableSlots.length === 0 ? (
          <div className="text-center py-14" style={{ color: 'var(--text-3)' }}>
            <div className="text-4xl mb-2">📭</div>
            <p>No available slots right now</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expert.availableSlots.map((slot) => (
              <div
                key={slot.date}
                className="rounded-2xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>
                  {formatDate(slot.date)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {slot.times.map((time) => {
                    const booked = isBooked(slot.date, time);
                    return (
                      <button
                        key={time}
                        disabled={booked}
                        onClick={() => handleBook(slot.date, time)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={
                          booked
                            ? {
                                background: 'var(--bg)',
                                color: 'var(--text-3)',
                                border: '1px solid var(--border-soft)',
                                cursor: 'not-allowed',
                                textDecoration: 'line-through',
                              }
                            : {
                                background: 'var(--sage-soft)',
                                color: 'var(--sage)',
                                border: '1px solid transparent',
                              }
                        }
                        onMouseEnter={e => { if (!booked) { e.target.style.background = 'var(--sage)'; e.target.style.color = '#fff'; } }}
                        onMouseLeave={e => { if (!booked) { e.target.style.background = 'var(--sage-soft)'; e.target.style.color = 'var(--sage)'; } }}
                      >
                        {time}{booked ? ' ✕' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
        Slot availability updates in real-time
      </div>
    </div>
  );
}