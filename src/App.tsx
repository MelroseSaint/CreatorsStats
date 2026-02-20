import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Owner } from './pages/Owner';
import { Dashboard } from './pages/Dashboard';
import { SponsorshipCalculator } from './pages/SponsorshipCalculator';
import { RevenueProjection } from './pages/RevenueProjection';
import { GrowthTracker } from './pages/GrowthTracker';
import { ReleasePlanner } from './pages/ReleasePlanner';
import { Settings } from './pages/Settings';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/owner" element={<Owner />} />
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="rates" element={<SponsorshipCalculator />} />
            <Route path="revenue" element={<RevenueProjection />} />
            <Route path="growth" element={<GrowthTracker />} />
            <Route path="planner" element={<ReleasePlanner />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
