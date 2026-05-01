import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/index.js';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  else if (!/^\+?[\d\s\-()]{8,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  if (!form.date) errors.date = 'Date is required';
  if (!form.timeSlot) errors.timeSlot = 'Time slot is required';
  return errors;
};

export default function BookingPage() {
  const { id } = useParams();               // expertId
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [expert, setExpert] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: searchParams.get('date') || '',
    timeSlot: searchParams.get('time') || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    api.getExpert(id).then(setExpert).catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      await api.createBooking({ expertId: id, ...form });
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-2">
          Your session with <strong>{expert?.name}</strong> on{' '}
          <strong>{form.date}</strong> at <strong>{form.timeSlot}</strong> has been requested.
        </p>
        <p className="text-slate-400 text-sm mb-8">A confirmation will be sent to {form.email}</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            Browse More Experts
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
    }`;

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-indigo-600 mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Book a Session</h1>
        {expert && (
          <p className="text-slate-500 text-sm mb-6">
            with <strong>{expert.name}</strong>
            {form.date && ` · ${form.date}`}
            {form.timeSlot && ` at ${form.timeSlot}`}
          </p>
        )}

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass('phone')} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass('date')}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot *</label>
              <select name="timeSlot" value={form.timeSlot} onChange={handleChange} className={inputClass('timeSlot')}>
                <option value="">Select time</option>
                {['09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="What would you like to discuss?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl text-sm"
          >
            {loading ? 'Booking...' : 'Confirm Booking →'}
          </button>
        </form>
      </div>
    </div>
  );
}