import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../config/axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const Services = React.memo(() => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    depositAmount: 0,
    category: 'main'
  });

  const fetchServices = useCallback(async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/api/services');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(t('services.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axiosInstance.post('/api/services', formData);
      fetchServices();
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        depositAmount: 0,
        category: 'main'
      });
    } catch (err) {
      console.error('Error creating service:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.error || t('services.errorCreating'));
    }
  }, [formData, fetchServices]);

  if (loading) {
    return (
      <>
        <PageHeader title={t('services.title')} subtitle={t('services.subtitle')} />
        <LoadingState message={t('common.loading')} />
      </>
    );
  }

  if (error && services.length === 0) {
    return (
      <>
        <PageHeader title={t('services.title')} subtitle={t('services.subtitle')} />
        <ErrorState title={t('services.errorLoading')} message={error} onRetry={fetchServices} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Configure service offerings and pricing"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            {t('services.addService')}
          </Button>
        }
      />

      {error && (
        <ErrorState title="Error" message={error} onRetry={fetchServices} />
      )}

      {services.length === 0 && !error ? (
        <EmptyState
          title={t('services.noServices')}
          message={t('services.noServicesMessage')}
          icon={DesignServicesIcon}
          action={() => setOpen(true)}
          actionLabel={t('services.addService')}
        />
      ) : (
        <Grid container spacing={2}>
          {services.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service._id}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box component="span" sx={{ fontWeight: 800, fontSize: '1rem' }}>
                        {service.name}
                      </Box>
                      <Chip
                        size="small"
                        label={service.category === 'main' ? t('services.main') : t('services.sub')}
                        color={service.category === 'main' ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    <Box component="p" sx={{ m: 0, fontSize: '0.875rem', color: 'text.secondary' }}>
                      {service.description || '—'}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1 }}>
                      <Chip size="small" label={`${service.duration} min`} />
                      <Chip size="small" label={`${service.price} SAR`} />
                      {service.depositAmount > 0 && (
                        <Chip size="small" label={`Deposit: ${service.depositAmount} SAR`} />
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('services.addNewService')}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label={t('common.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label={t('services.category')}
              select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="main">{t('services.main')}</MenuItem>
              <MenuItem value="sub">{t('services.sub')}</MenuItem>
            </TextField>
            <TextField
              label={t('services.description')}
              multiline
              minRows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t('services.duration')}
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  inputProps={{ min: 15 }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t('services.price')}
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t('services.deposit')}
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {t('services.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

Services.displayName = 'Services';

export default Services;
