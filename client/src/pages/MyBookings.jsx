import { useState } from 'react';
import { api } from '../api/index.js';

const STATUS_STYLES = {
  pending:   'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_ICONS = {
  pending:   '🕐',
  confirmed: '✅',
  completed: '🏁',
};

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSearched(false);
    try {
      const data = await api.getBookingsByEmail(email.trim());
      setBookings(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 mt-1">Enter your email to view your sessions</p>
      </div>

      {/* Email search form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Empty state */}
      {searched && bookings.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-sm mt-1">No sessions booked with this email address</p>
        </div>
      )}

      {/* Bookings list */}
      {bookings.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Expert info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      booking.expertId?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.expertId?.name}`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full bg-slate-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{booking.expertId?.name || 'Expert'}</p>
                    <p className="text-xs text-slate-500">{booking.expertId?.category}</p>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}>
                  {STATUS_ICONS[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Session details */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Date</p>
                  <p className="font-medium text-slate-700">{formatDate(booking.date)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Time</p>
                  <p className="font-medium text-slate-700">{booking.timeSlot}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-400 block mb-0.5">Notes</span>
                  {booking.notes}
                </div>
              )}

              <p className="text-xs text-slate-400 mt-3">
                Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}