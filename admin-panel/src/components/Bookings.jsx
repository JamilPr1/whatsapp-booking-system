import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../config/axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const Bookings = React.memo(() => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/api/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(t('bookings.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || t('bookings.errorUpdating'));
    }
  }, [fetchBookings]);

  if (loading) {
    return (
      <>
        <PageHeader title={t('bookings.title')} subtitle={t('bookings.subtitle')} />
        <LoadingState message={t('common.loading')} />
      </>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <>
        <PageHeader title={t('bookings.title')} subtitle={t('bookings.subtitle')} />
        <ErrorState title={t('bookings.errorLoading')} message={error} onRetry={fetchBookings} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Bookings" subtitle="View and manage all bookings" />

      {error && (
        <ErrorState title="Error" message={error} onRetry={fetchBookings} />
      )}

      {bookings.length === 0 && !error ? (
        <EmptyState
          title={t('bookings.noBookings')}
          message={t('bookings.noBookingsMessage')}
          icon={CalendarTodayIcon}
        />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.date')}</TableCell>
                  <TableCell>{t('common.time')}</TableCell>
                  <TableCell>{t('bookings.client')}</TableCell>
                  <TableCell>{t('bookings.service')}</TableCell>
                  <TableCell>{t('common.district')}</TableCell>
                  <TableCell>{t('common.status')}</TableCell>
                  <TableCell>{t('bookings.payment')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => {
                  const statusColor =
                    booking.status === 'confirmed'
                      ? 'success'
                      : booking.status === 'pending'
                        ? 'warning'
                        : booking.status === 'cancelled'
                          ? 'error'
                          : 'default';
                  const payColor =
                    booking.payment?.status === 'paid'
                      ? 'success'
                      : booking.payment?.status === 'partial'
                        ? 'warning'
                        : booking.payment?.status === 'refunded'
                          ? 'info'
                          : 'default';

                  return (
                    <TableRow key={booking._id} hover>
                      <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.bookingTime}</TableCell>
                      <TableCell>{booking.clientId?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.serviceId?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.location?.district || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip size="small" color={statusColor} label={booking.status} />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" color={payColor} label={booking.payment?.status || 'N/A'} />
                      </TableCell>
                      <TableCell align="right">
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel>{t('common.status')}</InputLabel>
                          <Select
                            label={t('common.status')}
                            value={booking.status}
                            onChange={(e) => updateStatus(booking._id, e.target.value)}
                          >
                            <MenuItem value="pending">{t('dashboard.pending')}</MenuItem>
                            <MenuItem value="confirmed">{t('dashboard.confirmed')}</MenuItem>
                            <MenuItem value="in-progress">{t('dashboard.pending')}</MenuItem>
                            <MenuItem value="completed">{t('dashboard.completed')}</MenuItem>
                            <MenuItem value="cancelled">{t('dashboard.pending')}</MenuItem>
                          </Select>
                        </FormControl>
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

Bookings.displayName = 'Bookings';

export default Bookings;
