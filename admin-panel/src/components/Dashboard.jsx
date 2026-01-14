import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../config/axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import EventNoteIcon from '@mui/icons-material/EventNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GroupIcon from '@mui/icons-material/Group';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import UpcomingIcon from '@mui/icons-material/Upcoming';

import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const Dashboard = React.memo(() => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await axiosInstance.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(t('dashboard.noData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <>
        <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
        <LoadingState message={t('common.loading')} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
        <ErrorState title={t('dashboard.errorLoading')} message={error} onRetry={fetchStats} />
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
        <ErrorState title={t('common.noData')} message={t('dashboard.noData')} onRetry={fetchStats} />
      </>
    );
  }

  const cards = [
    { label: t('dashboard.totalBookings'), value: stats.totalBookings, icon: <EventNoteIcon />, color: '#1f6feb' },
    { label: t('dashboard.pending'), value: stats.pendingBookings, icon: <PendingActionsIcon />, color: '#9a6700' },
    { label: t('dashboard.confirmed'), value: stats.confirmedBookings, icon: <TaskAltIcon />, color: '#1a7f37' },
    { label: t('dashboard.completed'), value: stats.completedBookings, icon: <DoneAllIcon />, color: '#0969da' },
    { label: t('dashboard.clients'), value: stats.totalClients, icon: <GroupIcon />, color: '#6e40c9' },
    { label: t('dashboard.activeServices'), value: stats.totalServices, icon: <DesignServicesIcon />, color: '#cf222e' },
    { label: t('dashboard.upcoming'), value: stats.upcomingBookings, icon: <UpcomingIcon />, color: '#57606a' }
  ];

  return (
    <>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.label}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: `${c.color}12`,
                    color: c.color
                  }}
                >
                  {c.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {c.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {c.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
