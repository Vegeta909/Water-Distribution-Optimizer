import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OpacityIcon from '@mui/icons-material/Opacity';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TimelineIcon from '@mui/icons-material/Timeline';
import MonitorIcon from '@mui/icons-material/Monitor';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <OpacityIcon sx={{ mr: 1, transform: 'rotate(45deg)' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Water Distribution Optimizer
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={RouterLink} to="/">Home</MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="/sensor-data">Sensor Data</MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="/monitoring">Monitoring</MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="/max-flow">Optimize Flow</MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="/minimum-spanning-tree">Pipeline Design</MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="/shortest-path">Water Routing</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                startIcon={<OpacityIcon />}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/sensor-data"
                color="inherit"
                startIcon={<TimelineIcon />}
              >
                Sensor Data
              </Button>
              <Button
                component={RouterLink}
                to="/monitoring"
                color="inherit"
                startIcon={<MonitorIcon />}
              >
                Monitoring
              </Button>
              <Button
                component={RouterLink}
                to="/max-flow"
                color="inherit"
              >
                Max Flow
              </Button>
              <Button
                component={RouterLink}
                to="/minimum-spanning-tree"
                color="inherit"
              >
                MST
              </Button>
              <Button
                component={RouterLink}
                to="/shortest-path"
                color="inherit"
              >
                Shortest Path
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
