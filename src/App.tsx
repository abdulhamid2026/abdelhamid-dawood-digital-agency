import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SiteSettingsProvider, useSiteSettings } from "@/hooks/useSiteSettings";
import SplashScreen from "@/components/SplashScreen";
import TechBlogPage from './pages/TechBlogPage';
import TechBlogSectionPage from './pages/TechBlogSectionPage';
import TechBlogPostPage from './pages/TechBlogPostPage';
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import AboutPage from "@/pages/AboutPage";
import BookingPage from "@/pages/BookingPage";
import ContactPage from "@/pages/ContactPage";
import AssistantPage from "@/pages/AssistantPage";
import ServicePage from "@/pages/ServicePage";
import PortfolioPage from "@/pages/PortfolioPage";
import PortfolioDetailPage from "@/pages/PortfolioDetailPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/pages/ProfilePage";
import MessagesPage from "@/pages/MessagesPage";
import PackagesPage from "@/pages/PackagesPage";
import AppsStorePage from "@/pages/AppsStorePage";
import AppDetailPage from "@/pages/AppDetailPage";
import LiveStreamPage from "@/pages/LiveStreamPage";
import WifiNetworksPage from "@/pages/WifiNetworksPage";
import WifiSystemPage from "@/pages/WifiSystemPage";
import WifiPurchasePage from "@/pages/WifiPurchasePage";
import AIToolsPage from "@/pages/AIToolsPage";
import GuestBlockedPage from "@/pages/GuestBlockedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

/** Route available to registered members only — guests see a registration invite. */
const MemberRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (isGuest) return <GuestBlockedPage />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuth();
  const { isLoading: settingsLoading, getBool } = useSiteSettings();

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (showSplash && getBool('splash_enabled')) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
      <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
      <Route path="/services/:serviceId" element={<MemberRoute><ServicePage /></MemberRoute>} />
      <Route path="/portfolio" element={<MemberRoute><PortfolioPage /></MemberRoute>} />
      <Route path="/portfolio/:itemId" element={<MemberRoute><PortfolioDetailPage /></MemberRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<MemberRoute><ProfilePage /></MemberRoute>} />
      <Route path="/messages" element={<MemberRoute><MessagesPage /></MemberRoute>} />
      <Route path="/packages" element={<MemberRoute><PackagesPage /></MemberRoute>} />
      <Route path="/apps-store" element={<MemberRoute><AppsStorePage /></MemberRoute>} />
      <Route path="/apps-store/:appId" element={<MemberRoute><AppDetailPage /></MemberRoute>} />
      <Route path="/live-stream" element={<MemberRoute><LiveStreamPage /></MemberRoute>} />
      <Route path="/wifi-networks" element={<MemberRoute><WifiNetworksPage /></MemberRoute>} />
      <Route path="/wifi-networks/:productId" element={<MemberRoute><WifiSystemPage /></MemberRoute>} />
      <Route path="/wifi-networks/:productId/purchase" element={<MemberRoute><WifiPurchasePage /></MemberRoute>} />
      <Route path="/ai-tools" element={<MemberRoute><AIToolsPage /></MemberRoute>} />
      <Route path="/tech-blog" element={<TechBlogPage />} />
      <Route path="/tech-blog/post/:id" element={<TechBlogPostPage />} />
      <Route path="/tech-blog/:slug" element={<TechBlogSectionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
