import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const drawerWidth = 260;
  const menuItems = [
    { path: '/dashboard', label: t('sidebar.dashboard'), icon: <DashboardIcon /> },
    { path: '/bookings', label: t('sidebar.bookings'), icon: <EventNoteIcon /> },
    { path: '/services', label: t('sidebar.services'), icon: <DesignServicesIcon /> },
    { path: '/schedules', label: t('sidebar.schedules'), icon: <CalendarMonthIcon /> },
    { path: '/users', label: t('sidebar.users'), icon: <GroupIcon /> },
    { path: '/settings', label: t('sidebar.settings'), icon: <SettingsIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0,0,0,0.08)'
        }
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            On-site Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>
      <Box sx={{ overflow: 'auto', px: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
