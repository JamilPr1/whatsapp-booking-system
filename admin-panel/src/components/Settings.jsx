import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MapIcon from '@mui/icons-material/Map';
import PaymentsIcon from '@mui/icons-material/Payments';
import ScheduleIcon from '@mui/icons-material/Schedule';

import PageHeader from './PageHeader';

const Settings = React.memo(() => {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WhatsAppIcon color="success" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('settings.whatsapp')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.whatsappDesc')}
                </Typography>
                <Chip size="small" label="ENV: WHATSAPP_*" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MapIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('settings.maps')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.mapsDesc')}
                </Typography>
                <Chip size="small" label="ENV: GOOGLE_MAPS_API_KEY" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PaymentsIcon color="warning" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('settings.payments')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.paymentsDesc')}
                </Typography>
                <Chip size="small" label="ENV: STRIPE_*" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ScheduleIcon color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('settings.notifications')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.notificationsDesc')}
                </Typography>
                <Chip size="small" label="ENV: TIMEZONE=Asia/Riyadh" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
});

Settings.displayName = 'Settings';

export default Settings;
