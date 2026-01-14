import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const Schedules = React.memo(() => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/schedules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(t('schedules.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const unlockSchedule = useCallback(async (id) => {
    if (!window.confirm(t('schedules.unlockConfirm'))) {
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('token');
      await axios.patch(`/api/admin/schedules/${id}/unlock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedules();
    } catch (err) {
      console.error('Error unlocking schedule:', err);
      setError(err.response?.data?.error || t('schedules.errorUnlocking'));
    }
  }, [fetchSchedules]);

  if (loading) {
    return (
      <>
        <PageHeader title={t('schedules.title')} subtitle={t('schedules.subtitle')} />
        <LoadingState message={t('common.loading')} />
      </>
    );
  }

  if (error && schedules.length === 0) {
    return (
      <>
        <PageHeader title={t('schedules.title')} subtitle={t('schedules.subtitle')} />
        <ErrorState title={t('schedules.errorLoading')} message={error} onRetry={fetchSchedules} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Schedules" subtitle="Daily district lock status and booking counts" />

      {error && (
        <ErrorState title="Error" message={error} onRetry={fetchSchedules} />
      )}

      {schedules.length === 0 && !error ? (
        <EmptyState
          title={t('schedules.noSchedules')}
          message={t('schedules.noSchedulesMessage')}
          icon={CalendarTodayIcon}
        />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.date')}</TableCell>
                  <TableCell>{t('common.district')}</TableCell>
                  <TableCell>{t('schedules.bookings')}</TableCell>
                  <TableCell>{t('schedules.locked')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => {
                  const dateLabel = new Date(schedule.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <TableRow key={schedule._id} hover>
                      <TableCell>{dateLabel}</TableCell>
                      <TableCell>{schedule.district || '—'}</TableCell>
                      <TableCell>{schedule.bookings?.length || 0}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={schedule.isLocked ? t('schedules.locked') : t('schedules.unlocked')}
                          color={schedule.isLocked ? 'error' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {schedule.isLocked ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LockOpenIcon />}
                            onClick={() => unlockSchedule(schedule._id)}
                          >
                            {t('schedules.unlock')}
                          </Button>
                        ) : (
                          <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                            —
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
});

Schedules.displayName = 'Schedules';

export default Schedules;
