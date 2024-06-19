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

// Contexts
import StateContext from '../Contexts/StateContext';

function ProfileUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  // console.log(props.userProfile);

  const initialState = {
    // dataIsLoaded: true,
    profileNameValue: props.userProfile.profileName,
    emailValue: props.userProfile.email,
    aboutValue: props.userProfile.about,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: false,
  };

  // Use Immer's produce function to create an immer-ized reducer
  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchProfileNameChange':
        draft.profileNameValue = action.profileNameChosen;
        return;
      case 'catchEmailChange':
        draft.emailValue = action.emailChosen;
        return;
      case 'catchAboutChange':
        draft.aboutValue = action.aboutChosen;
        return;
      case 'catchUploadedPicture':
        draft.uploadedPicture = action.pictureChosen;
        return;
      case 'catchProfilePictureChange':
        draft.profilePictureValue = action.profilePictureChosen;
        return;

      case 'changeSendRequest':
        draft.sendRequest = true;
        return;

      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // useEffet co catch uploaded picture
  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: 'catchProfilePictureChange',
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  //   useEffect to return Request
  useEffect(() => {
    if (state.sendRequest) {
      async function UpdateProfile() {
        const formData = new FormData();

        if (typeof state.profilePictureValue === 'string' || state.profilePictureValue === null) {
          formData.append('profile_name', state.profileNameValue);
          formData.append('email', state.emailValue);
          formData.append('about', state.aboutValue);
          formData.append('profile', GlobalState.userId);
        } else {
          formData.append('profile_name', state.profileNameValue);
          formData.append('email', state.emailValue);
          formData.append('about', state.aboutValue);
          formData.append('profile_picture', state.profilePictureValue);
          formData.append('profile', GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          // console.log(response.data);
          navigate(0);
        } catch (e) {
          console.log(e.response);
        }
      }
      UpdateProfile();
    }
  }, [state.sendRequest]);

  function FormSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'changeSendRequest' });
  }

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== 'string') {
      return <ul>{state.profilePictureValue ? <li>{state.profilePictureValue.name}</li> : ''}</ul>;
    } else if (typeof state.profilePictureValue === 'string') {
      return (
        <Grid
          item
          style={{
            marginTop: '0.5rem',
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          <img
            src={props.userProfile.profilePic}
            style={{
              height: '6rem',
              width: '6rem',
              borderRadius: '50%',

              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Grid>
      );
    }
  }

  return (
    <>
      <div
        style={{
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '3rem',
        }}
      >
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent={'center'}>
            <Typography variant='h4' sx={{ textAlign: 'center' }}>
              MY PROFILE
            </Typography>
          </Grid>
          <Grid
            item
            container
            sx={{
              mt: '2rem',
            }}
          >
            <TextField
              id='profilname'
              label='Profile Name*'
              variant='outlined'
              fullWidth
              value={state.profileNameValue}
              onChange={(e) =>
                dispatch({ type: 'catchProfileNameChange', profileNameChosen: e.target.value })
              }
            />
          </Grid>

          <Grid
            item
            container
            sx={{
              mt: '1rem',
            }}
          >
            <TextField
              id='email'
              label='Email*'
              variant='outlined'
              fullWidth
              type='email'
              value={state.emailValue}
              onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })}
            />
          </Grid>

          <Grid
            item
            container
            sx={{
              mt: '1rem',
            }}
          >
            <TextField
              id='about'
              label='About'
              variant='outlined'
              fullWidth
              multiline
              rows={6}
              value={state.aboutValue}
              onChange={(e) => dispatch({ type: 'catchAboutChange', aboutChosen: e.target.value })}
            />
          </Grid>

          <Grid item container>
            {ProfilePictureDisplay()}
          </Grid>

          <Grid
            item
            container
            justifyContent={'center'}
            sx={{
              mt: '1rem',
            }}
          >
            <Button
              variant='contained'
              component='label'
              fullWidth
              sx={{
                backgroundColor: ' #1976D2',
                fontSize: '0.8rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '15rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1988D2',
                },
              }}
            >
              UPLOAD PICTURE
              <input
                type='file'
                multiple
                accept='image/png, image/gif, image/jpeg, image/jpg, image/webp'
                hidden
                onChange={(e) =>
                  dispatch({
                    type: 'catchUploadedPicture',
                    pictureChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>

          <Grid
            item
            container
            justifyContent={'center'}
            sx={{
              mt: '1rem',
              mb: '2rem',
            }}
          >
            <Button
              variant='contained'
              fullWidth
              type='submit'
              sx={{
                backgroundColor: ' #649A90',
                fontSize: '0.8rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '15rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#82BFB5 ',
                },
              }}
            >
              UPDATE
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default ProfileUpdate;
