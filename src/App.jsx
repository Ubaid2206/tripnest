import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import WishlistDrawer from './components/WishlistDrawer';
import Toast from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import StaysPage from './pages/StaysPage';
import StayDetailPage from './pages/StayDetailPage';
import FlightsPage from './pages/FlightsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import PackagesPage from './pages/PackagesPage';
import HostDashboardPage from './pages/HostDashboardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
          {/* Global Sticky Header */}
          <Header />

          {/* Main Content Router */}
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<Navigate to="/" replace />} />
              <Route path="/stays" element={<StaysPage />} />
              <Route path="/stays/:id" element={<StayDetailPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/journeys" element={<Navigate to="/packages" replace />} />
              <Route path="/host-dashboard" element={<HostDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Modals & Drawers */}
          <AuthModal />
          <WishlistDrawer />
          <Toast />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
