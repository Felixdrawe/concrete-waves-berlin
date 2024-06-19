import React, { useState, useEffect, useReducer, useContext } from 'react';
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
} from '@mui/material';

// Components
import ProfileUpdate from './ProfileUpdate';

// Assets
import defaultProfilePicture from '../Assets/defaultProfilePicture.jpg';

// Contexts
import StateContext from '../Contexts/StateContext';

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    userProfile: {
      profileName: '',
      email: '',
      profilePic: '',
      about: '',
    },
    dataIsLoaded: true,
  };

  // Use Immer's produce function to create an immer-ized reducer
  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchUserProfileInfo':
        draft.userProfile.profileName = action.profileObject.profile_name;
        draft.userProfile.email = action.profileObject.email;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.about = action.profileObject.about;
        return;

      case 'loadingDone':
        draft.dataIsLoaded = false;
        return;
      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // request to get profile info
  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
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

  function WelcomeDisplay() {
    if (
      state.userProfile.profileName === null ||
      state.userProfile.profileName === '' ||
      state.userProfile.email === null ||
      state.userProfile.email === ''
    ) {
      return (
        <Typography
          variant='h5'
          style={{ textAlign: 'center', marginTop: '10rem' }}
        >
          Welcome{' '}
          <span style={{ color: 'green', fontWeight: 'bolder' }}>
            {GlobalState.userUsername}
          </span>{' '}
          , please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          sx={{
            maxWidth: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Grid item>
            <img
              style={{
                height: '9.9rem',
                width: '10rem',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '50%',
              }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>
          <Grid item>
            <Grid item>
              <Typography variant='h5' style={{ textAlign: 'center' }}>
                Welcome{' '}
                <span
                  style={{
                    color: '#1976D2',
                    fontWeight: 'bolder',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate(`/profiles-list/${GlobalState.userId}`)
                  }
                >
                  {GlobalState.userUsername}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoaded === true) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <>
      <div>{WelcomeDisplay()}</div>
      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
