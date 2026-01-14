import React, { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingState from './components/LoadingState';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const Bookings = lazy(() => import('./components/Bookings'));
const Services = lazy(() => import('./components/Services'));
const Schedules = lazy(() => import('./components/Schedules'));
const Users = lazy(() => import('./components/Users'));
const Settings = lazy(() => import('./components/Settings'));

function App() {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
    
    // Set initial direction
    const lang = localStorage.getItem('i18nextLng') || 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    // Update direction when language changes
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#1f6feb' },
          background: { default: '#f6f8fa', paper: '#ffffff' }
        },
        shape: { borderRadius: 10 },
        direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
      }),
    [i18n.language]
  );

  const cacheRtl = useMemo(() => {
    if (i18n.language === 'ar') {
      return createCache({
        key: 'muirtl',
        stylisPlugins: [rtlPlugin]
      });
    }
    return createCache({ key: 'css' });
  }, [i18n.language]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingState message="Initializing..." fullScreen />
      </ThemeProvider>
    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          {isAuthenticated ? (
            <Route
              path="/*"
              element={
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                  <Sidebar />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header onLogout={handleLogout} />
                    <Box component="main" sx={{ flex: 1, p: 3, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
                      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><LoadingState message="Loading page..." /></Box>}>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/bookings" element={<Bookings />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/schedules" element={<Schedules />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                      </Suspense>
                    </Box>
                  </Box>
                </Box>
              }
            />
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
