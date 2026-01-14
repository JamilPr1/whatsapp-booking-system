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
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';

import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const Users = React.memo(() => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(t('users.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <>
        <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />
        <LoadingState message={t('common.loading')} />
      </>
    );
  }

  if (error && users.length === 0) {
    return (
      <>
        <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />
        <ErrorState title={t('users.errorLoading')} message={error} onRetry={fetchUsers} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      {error && (
        <ErrorState title={t('common.error')} message={error} onRetry={fetchUsers} />
      )}

      {users.length === 0 && !error ? (
        <EmptyState
          title={t('users.noUsers')}
          message={t('users.noUsersMessage')}
          icon={GroupIcon}
        />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell>{t('common.phone')}</TableCell>
                  <TableCell>{t('common.email')}</TableCell>
                  <TableCell>{t('common.role')}</TableCell>
                  <TableCell>{t('common.district')}</TableCell>
                  <TableCell>{t('common.status')}</TableCell>
                  <TableCell>{t('common.created')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const roleColor =
                    user.role === 'admin'
                      ? 'error'
                      : user.role === 'provider'
                        ? 'primary'
                        : user.role === 'driver'
                          ? 'secondary'
                          : 'default';

                  return (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phoneNumber || '—'}</TableCell>
                      <TableCell>{user.email || '—'}</TableCell>
                      <TableCell>
                        <Chip size="small" label={user.role} color={roleColor} variant="outlined" />
                      </TableCell>
                      <TableCell>{user.location?.district || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={user.isActive ? t('common.active') : t('common.inactive')}
                          color={user.isActive ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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

Users.displayName = 'Users';

export default Users;
