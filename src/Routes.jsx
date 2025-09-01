import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ViolationHistory from './pages/violation-history';
import LiveMonitoringDashboard from './pages/live-monitoring-dashboard';
import LoginPage from './pages/login';
import UserProfileSettings from './pages/user-profile-settings';
import CameraManagement from './pages/camera-management';
import AnalyticsReports from './pages/analytics-reports';
import AIChatAssistance from './pages/ai-chat-assistance';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsReports />} />
        <Route path="/violation-history" element={<ViolationHistory />} />
        <Route path="/live-monitoring-dashboard" element={<LiveMonitoringDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile-settings" element={<UserProfileSettings />} />
        <Route path="/camera-management" element={<CameraManagement />} />
        <Route path="/analytics-reports" element={<AnalyticsReports />} />
        <Route path="/ai-chat-assistance" element={<AIChatAssistance />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
