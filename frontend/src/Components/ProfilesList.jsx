import React, { useState, useContext, useEffect, useReducer, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
} from '@mui/material';

// Components
import ProfileUpdate from './ProfileUpdate';

//Assets
import defaultProfilePicture from '../Assets/defaultProfilePicture.jpg';

// Contexts
import StateContext from '../Contexts/StateContext';

function ProfilesList() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    dataIsLoaded: true,
    profilesList: [],
  };

  // Use Immer's produce function to create an immer-ized reducer
  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchProfiles':
        draft.profilesList = action.profilesArray;
        return;
      case 'loadingDone':
        draft.dataIsLoaded = false;
      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // request to all profiles
  useEffect(() => {
    async function GetProfiles() {
      try {
        const response = await Axios.get(`http://localhost:8000/api/profiles/`);
        // console.log(response.data);

        dispatch({
          type: 'catchProfiles',
          profilesArray: response.data,
        });
        dispatch({ type: 'loadingDone' });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfiles();
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
      <Grid
        container
        justifyContent='flex-start'
        spacing={2}
        marginTop={0.1}
        style={{ padding: '10px' }}
      >
        {state.profilesList.map((profile) => {
          function ListingsDisplay() {
            if (!profile.profile_listings || profile.profile_listings.length === 0) {
              return (
                <Button disabled size='small'>
                  No Spots added
                </Button>
              );
            } else if (profile.profile_listings.length === 1) {
              return (
                <Button size='small' onClick={() => navigate(`/profiles-list/${profile.profile}`)}>
                  1 Spot added
                </Button>
              );
            } else {
              return (
                <Button size='small' onClick={() => navigate(`/profiles-list/${profile.profile}`)}>
                  {profile.profile_listings.length} Spots added
                </Button>
              );
            }
          }

          if (profile.profile_name && profile.email) {
            return (
              <Grid key={profile.id} item xs={12} sm={6} md={4} lg={3} style={{ padding: 10 }}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CardMedia
                    component='img'
                    style={{
                      height: 200,
                      width: 200,
                  
                      borderRadius: '50%',
            
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }} // Ensure image covers card area
                    image={
                      profile.profile_picture ? profile.profile_picture : defaultProfilePicture
                    }
                    alt='Profile Picture'
                  />
                  <CardContent style={{ flexGrow: 1, paddingLeft: '0.5rem', paddingBottom: '0rem' }}>
                    <Typography gutterBottom variant='h5' component='div'>
                      {profile.profile_name}
                    </Typography>
                  </CardContent>
                  <CardActions>{ListingsDisplay()}</CardActions>
                </Card>
              </Grid>
            );
          }
        })}
      </Grid>
    </Container>
  );
}

export default ProfilesList;
