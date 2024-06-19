import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import { produce } from 'immer';
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // Import the mail icon

// Assets
import defaultProfilePicture from '../Assets/defaultProfilePicture.jpg';

// Contexts
import StateContext from '../Contexts/StateContext';

function ProfileDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const params = useParams();

  const initialState = {
    userProfile: {
      profileName: '',
      email: '',
      profilePic: '',
      about: '',
      profileListings: [],
    },
    dataIsLoaded: true,
  };

  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchUserProfileInfo':
        draft.userProfile.profileName = action.profileObject.profile_name;
        draft.userProfile.email = action.profileObject.email;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.about = action.profileObject.about;
        draft.userProfile.profileListings = action.profileObject.profile_listings;
        return;

      case 'loadingDone':
        draft.dataIsLoaded = false;
        return;
      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(`http://localhost:8000/api/profiles/${params.id}/`);
        // console.log(response.data);

        dispatch({
          type: 'catchUserProfileInfo',
          profileObject: response.data,
        });
        dispatch({ type: 'loadingDone' });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []);

  if (state.dataIsLoaded === true) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Container maxWidth='xl'>
      <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '40rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem', marginBottom: '2rem' }}>
        <CardMedia
          component='img'
          height='140'
          image={state.userProfile.profilePic || defaultProfilePicture}
          alt='Profile Picture'
          style={{
           
            borderRadius: '50%',
            margin: 'auto',
            width: '10rem',
            height: '9.9rem',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
         
        />
        <CardContent style={{ flexGrow: 1 }}>
          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Grid item>
              <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
                Spots added by {' '}
                <span style={{ color: '#1976D2', fontWeight: 'bolder' }}>
                  {state.userProfile.profileName}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h5' style={{ textAlign: 'center' }}>
                Contact: <MailOutlineIcon style={{ verticalAlign: 'middle', marginRight: '4px',  color: '#1976D2' }} />
                <span style={{ color: '#1976D2', fontWeight: 'normal' }}>{state.userProfile.email}</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h5' style={{ textAlign: 'center' }}>
                About:{' '}
                <span style={{ fontWeight: 'normal', display: 'block', marginTop: '1rem' }}>
                  {state.userProfile.about}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container justifyContent='flex-start' spacing={2} style={{ padding: '10px' }}>
        {state.userProfile.profileListings.map((listing) => {
          return (
            <Grid key={listing.id} item xs={12} sm={6} md={4} lg={3} style={{ padding: 10 }}>
              <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component='img'
                  height='140'
                  image={
                    `http://localhost:8000${listing.picture1}`
                      ? `http://localhost:8000${listing.picture1}`
                      : defaultProfilePicture
                  }
                  alt='Listing Picture'
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant='h5' component='div'>
                    {listing.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.description.substring(0, 30)}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default ProfileDetail;
