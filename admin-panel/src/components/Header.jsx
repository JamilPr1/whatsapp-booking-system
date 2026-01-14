import React from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';

const Header = ({ onLogout }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      <Toolbar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('header.title')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LanguageIcon />}
            onClick={toggleLanguage}
            sx={{ minWidth: 100 }}
          >
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </Button>
          <Tooltip title={t('header.logout')}>
            <IconButton onClick={onLogout} edge="end" aria-label="logout">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
