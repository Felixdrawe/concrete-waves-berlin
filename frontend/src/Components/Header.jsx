import * as React from 'react';
import { useContext } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import Logo from '../Assets/Logo.jsx';
import profilePic from '../Assets/defaultProfilePicture.jpg';

import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

const pages = ['Map', 'Add Spot', 'Profiles'];
const settings = ['Profile', 'Logout', 'Login'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);
  // console.log(GlobalState);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (page) => {
    handleCloseNavMenu();
    if (page === 'Add Spot') {
      navigate('/add-spot');
    } else if (page === 'Profiles') {
      navigate('/profiles-list');
    } else if (page === 'Map') {
      navigate('/map');
    } else if (page === 'Favorites') {
      navigate('/map-favs');
    } else if (page === 'Logo') {
      navigate('/map');
    }
  };

  const handleProfileClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Profile') {
      navigate('/profile');
    } else if (setting === 'Logout') {
      handleLogout();
    } else if (setting === 'Login') {
      navigate('/login');
    }
  };

  async function handleLogout() {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      try {
        const response = await Axios.post(
          'http://localhost:8000/api-auth-djoser/token/logout/',
          GlobalState.userToken,
          { headers: { Authorization: 'Token '.concat(GlobalState.userToken) } }
        );
        // console.log(response);
        GlobalDispatch({ type: 'logout' });
        navigate('/');
      } catch (e) {
        console.log(e);
      }
    }
    handleCloseUserMenu();
  }

  let settings = [];
  if (GlobalState.userIsLogged) {
    settings = ['Profile', 'Logout'];
  } else {
    settings = ['Login'];
  }

  const pages = ['Map', GlobalState.userIsLogged ? 'Favorites' : null, 'Add Spot', 'Profiles'];
  let filteredPages = pages.filter((page) => page !== null);

  // const settings = ['Profile', 'Logout', 'Login'];

  // let menuPages = pages.filter((page) => page !== null);

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Logo style={{ width: 70, height: 70, margin: 15 }} />
          </Box>
          <Typography
            onClick={() => navigate('/map')}
            variant='h6'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CONCRETE WAVES
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {filteredPages.map((page) => (
                <MenuItem key={page} onClick={() => handleMenuClick(page)}>
                  {' '}
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* // Normal View */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
  {filteredPages.map((page) => (
    <Button
      key={page}
      onClick={() => handleMenuClick(page)}
      sx={{ my: 2, color: 'white', display: 'block' }}
    >
      {page}
    </Button>
  ))}
</Box> */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <Logo style={{ width: 40, height: 40 }} />
          </Box>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/map'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CW
          </Typography>
         {/* Normal View */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {filteredPages.map((page) => (
              <Button
                key={page}
                onClick={() => handleMenuClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {GlobalState.userIsLogged ? (
            <Typography variant='small' sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}>
              Welcome back {GlobalState.userUsername}!
            </Typography>
          ) : (
            <Typography variant='small' sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}>
              Login or Register!
            </Typography>
          )}
          {/* Profile */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src={profilePic} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    handleProfileClick(setting);
                  }}
                >
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
