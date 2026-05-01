const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const api = {
  // Experts
  getExperts: (params) =>
    fetch(`${BASE}/experts?${new URLSearchParams(params)}`).then(handleResponse),

  getExpert: (id) =>
    fetch(`${BASE}/experts/${id}`).then(handleResponse),

  // Bookings
  createBooking: (data) =>
    fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getBookingsByEmail: (email) =>
    fetch(`${BASE}/bookings?email=${encodeURIComponent(email)}`).then(handleResponse),

  updateBookingStatus: (id, status) =>
    fetch(`${BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};