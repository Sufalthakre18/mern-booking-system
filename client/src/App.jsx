import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import Navbar from './components/Navbar.jsx';
import ExpertList from './pages/ExpertList.jsx';
import ExpertDetail from './pages/ExpertDetail.jsx';
import BookingPage from './pages/BookingPage.jsx';
import MyBookings from './pages/MyBookings.jsx';

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ExpertList />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SocketProvider>
  );
}