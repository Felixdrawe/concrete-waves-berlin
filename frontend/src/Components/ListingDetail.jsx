import React, { useState, useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import { produce } from 'immer';
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  Container,
  Box,
} from '@mui/material';

// React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RoomIcon from '@mui/icons-material/Room';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';

// Components
import ListingUpdate from './ListingUpdate';

// Contexts
import StateContext from '../Contexts/StateContext';

function ListingDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const params = useParams();
  console.log(GlobalState.userUsername);

  const initialState = {
    dataIsLoading: true,
    listingInfo: '',
    favorites: [],
  };

  // Use Immer's produce function to create an immer-ized reducer
  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchListingInfo':
        draft.listingInfo = action.listingObject;
        return;
      case 'catchFavorites':
        draft.favorites = action.favorites;
        return;
      case 'loadingDone':
        draft.dataIsLoading = false;
        return;
      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to handle button click to Google
  const handleButtonClick = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // request to get listing info
  const GetListingInfo = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/api/listings/${params.id}/`);
      dispatch({
        type: 'catchListingInfo',
        listingObject: response.data,
      });
      dispatch({ type: 'loadingDone' });
    } catch (error) {
      console.error('Error getting listing info:', error);
    }
  };

  // request to get all favorites
  const GetFavorites = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/api/listings/favorites/`);
      dispatch({ type: 'catchFavorites', favorites: response.data });
    } catch (error) {
      console.error('Error getting favorites:', error);
    }
  };

  useEffect(() => {
    GetListingInfo();
    GetFavorites();
  }, []);

  const addFavorite = async () => {
    try {
      await Axios.post(`http://localhost:8000/api/listings/${params.id}/favorites/create/`, {
        user: GlobalState.userId,
        listing: params.id,
      });
      // Fetch updated listing info after adding to favorites
      GetFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const deleteFavorite = async () => {
    try {
      const favorite = state.favorites.find(
        (favorite) => favorite.listing === state.listingInfo.id
      ); // Get the favorite object
      if (!favorite) {
        console.log('Favorite not found');
        return;
      }
      await Axios.delete(
        `http://localhost:8000/api/listings/${params.id}/favorites/${favorite.id}/delete/`
      );
      // Fetch updated listing info after deleting from favorites
      GetFavorites();
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    setCurrentPicture((prev) => (prev === listingPictures.length - 1 ? 0 : prev + 1));
  }

  function PreviousPicture() {
    setCurrentPicture((prev) => (prev === 0 ? listingPictures.length - 1 : prev - 1));
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (confirmDelete) {
      try {
        await Axios.delete(`http://localhost:8000/api/listings/${params.id}/delete/`);
        navigate('/map');
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  }

  return (
    <Container maxWidth='lg'>
      <Grid item style={{ marginTop: '1rem' }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link
            underline='hover'
            color='inherit'
            onClick={() => navigate('/map')}
            style={{ cursor: 'pointer' }}
          >
            Map
          </Link>

          <Typography color='text.primary'>{state.listingInfo.title}</Typography>
        </Breadcrumbs>
      </Grid>

      <Grid
        item
        container
        style={{
          maxWidth: '45rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          // border: '1px solid black',
          marginTop: '1rem',
          padding: '5px',
          justifyContent: 'center',
        }}
      >
        {/* Image slider */}
        {listingPictures.length > 0 && (
          <Grid
            item
            xs={12}
            sx={{
              position: 'relative',
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
              <IconButton
                onClick={PreviousPicture}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'common.white',
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <ArrowCircleLeftIcon fontSize='large' />
              </IconButton>
              <Box
                component='img'
                src={listingPictures[currentPicture]}
                sx={{
                  width: '100%',
                  height: 'auto',
                  boxShadow: 3,
                }}
              />
              <IconButton
                onClick={NextPicture}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'common.white',
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <ArrowCircleRightIcon fontSize='large' />
              </IconButton>
            </Box>
          </Grid>
        )}

        {/* Spot Infos */}
        <Grid
          item
          container
          sx={{
            padding: '1rem',
            marginTop: '1rem',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={12} container direction='column' spacing={1} justifyContent='center'>
            <Grid item>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RoomIcon sx={{ mr: 1 }} />
                <Typography variant='h4' align='center'>
                  {state.listingInfo.title}
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <Typography variant='h6' align='center'>
                Spot type:{' '}
                <span style={{ fontWeight: '700', color: 'primary.main' }}>
                  {state.listingInfo.spot_type}
                </span>
              </Typography>
            </Grid>

            <Grid item container style={{ marginTop: '1rem' }} justifyContent='center'>
              <Grid item container style={{ marginTop: '1rem' }} justifyContent='center'>
                {/* {GlobalState.userUsername && ( // Check if user is logged in
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={
                      state.favorites.some((favorite) => favorite.listing === state.listingInfo.id)
                        ? deleteFavorite
                        : addFavorite
                    }
                  >
                    {state.favorites.some((favorite) => favorite.listing === state.listingInfo.id)
                      ? 'Delete from Favorites'
                      : 'Add to Favorites'}
                  </Button>
                )} */}

                {GlobalState.userUsername && GlobalState.userIsLogged &&( // Check if user is logged in
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      console.log('Favorites:', state.favorites);
                      console.log('UserID:', GlobalState.userId);
                      const isFavorite = state.favorites.some((favorite) => {
                        console.log('Favorite User Type:', typeof favorite.user);
                        console.log('UserID Type:', typeof GlobalState.userId);
                        return (
                          favorite.listing === state.listingInfo.id &&
                          favorite.user === parseInt(GlobalState.userId)
                        );
                      });
                      console.log('isFavorite:', isFavorite);
                      if (isFavorite) {
                        deleteFavorite();
                      } else {
                        addFavorite();
                      }
                    }}
                  >
                    {state.favorites.some(
                      (favorite) =>
                        favorite.listing === state.listingInfo.id &&
                        favorite.user === parseInt(GlobalState.userId)
                    )
                      ? 'Delete from Favorites'
                      : 'Add to Favorites'}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          container
          sx={{
            padding: '1rem',
            marginTop: '1rem',
            justifyContent: 'center',
          }}
        >
          <Grid
            item
            xs={12}
            container
            direction='column'
            alignItems='center'
            sx={{ width: '100%' }}
          >
            <Typography variant='h5' align='center'>
              Level
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: 'max-content',
                  margin: 'auto',
                }}
              >
                {['beginner', 'intermediate', 'pro'].map((level) => (
                  <Box
                    key={level}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      my: 1,
                    }}
                  >
                    {state.listingInfo[level] ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <CheckBoxIcon sx={{ color: 'green', fontSize: '2rem', mr: 1 }} />
                        <Typography variant='h6'>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <CancelIcon sx={{ color: 'red', fontSize: '2rem', mr: 1 }} />
                        <Typography variant='h6'>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid
          item
          container
          sx={{
            padding: '1rem',
            justifyContent: 'center',
          }}
        >
          <Typography variant='h5' align='center'>
            Spot Condition: {state.listingInfo.conditions || 'Not available'}
          </Typography>
        </Grid>

        {/* Description */}
        {state.listingInfo.description && (
          <Grid
            item
            sx={{
              padding: '1rem',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h5' align='center'>
              Description:
            </Typography>
            <Typography variant='h6' align='center'>
              {state.listingInfo.description}
            </Typography>
          </Grid>
        )}
      </Grid>

      {/*  User Info */}
      <Grid
        container
        style={{
          maxWidth: '45rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          // border: '1px solid black',
          marginTop: '1rem',
          padding: '5px',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant='h5'
          style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}
        >
          Uploaded by{' '}
          <span
            style={{
              color: '#1976D2',

              fontWeight: 'bolder',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#1988D2',
              },
            }}
            onClick={() => navigate(`/profiles-list/${state.listingInfo.profile}`)}
          >
            {state.listingInfo.profile_profile_name}
          </span>
        </Typography>

        {GlobalState.userId == state.listingInfo.profile ? (
          <Grid item container justifyContent='space-around'>
            <Button variant='contained' color='primary' onClick={handleClickOpen}>
              Update
            </Button>
            <Button variant='contained' color='error' onClick={handleDelete}>
              Delete
            </Button>

            <Dialog open={open} onClose={handleClose} fullScreen>
              <ListingUpdate listingData={state.listingInfo} closeDialog={handleClose} />
            </Dialog>
          </Grid>
        ) : (
          ''
        )}
      </Grid>

      {/* Map */}
      <Grid item container sx={{ height: '35rem', marginTop: '2rem' }}>
        {state.listingInfo.latitude && state.listingInfo.longitude && (
          <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={15}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}@2x.png'
            />
            <Marker position={[state.listingInfo.latitude, state.listingInfo.longitude]}>
              <Popup>
                <div style={{ width: '150px' }}>
                  <Button
                    variant='contained'
                    fullWidth
                    size='small'
                    style={{ marginTop: '8px' }}
                    onClick={() =>
                      handleButtonClick(state.listingInfo.latitude, state.listingInfo.longitude)
                    }
                  >
                    Show on Google
                  </Button>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </Grid>
    </Container>
  );
}

export default ListingDetail;
