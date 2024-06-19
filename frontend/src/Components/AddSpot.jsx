import React, { useEffect, useReducer, useContext, useRef, useMemo } from 'react';
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
  Container,
  Box,
} from '@mui/material';
// React Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Contexts
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';
import { Global } from '@emotion/react';

const spotTypeOptions = [
  { value: '', label: '' },
  { value: 'Flat', label: 'Flat' },
  { value: 'Skatepark', label: 'Skatepark' },
  { value: 'Pumptrack', label: 'Pumptrack' },
  { value: 'Bowl', label: 'Bowl' },
];

const conditionsOptions = [
  { value: '', label: '' },
  { value: 'Very Good', label: 'Very Good' },
  { value: 'Good', label: 'Good' },
  { value: 'Average', label: 'Average' },
  { value: 'Poor', label: 'Poor' },
];

function AddSpot() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: '',
    descriptionValue: '',
    spot_typeValue: '',
    conditionsValue: '',
    latitudeValue: 52.52,
    longitudeValue: 13.4,
    beginnerValue: false,
    intermediateValue: false,
    advancedValue: false,
    picture1Value: '',
    picture2Value: '',
    picture3Value: '',
    picture4Value: '',
    picture5Value: '',
    markerPosition: {
      lat: '52.52',
      lng: '13.40',
    },
    uploadedPictures: [],
    sendRequest: false,
    userProfile: {
      profileName: '',
      email: '',
    },
  };

  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchTitleChange':
        draft.titleValue = action.titleChosen;
        return;
      case 'catchDescriptionChange':
        draft.descriptionValue = action.descriptionChosen;
        return;
      case 'catchSpotTypeChange':
        draft.spot_typeValue = action.spotTypeChosen;
        return;
      case 'catchConditionsChange':
        draft.conditionsValue = action.conditionsChosen;
        return;
      case 'catchLatitudeChange':
        draft.latitudeValue = action.latitudeChosen;
        return;
      case 'catchLongitudeChange':
        draft.longitudeValue = action.longitudeChosen;
        return;
      case 'catchBeginnerChange':
        draft.beginnerValue = action.beginnerChosen;
        return;
      case 'catchIntermediateChange':
        draft.intermediateValue = action.intermediateChosen;
        return;
      case 'catchAdvancedChange':
        draft.advancedValue = action.advancedChosen;
        return;
      case 'catchPicture1Change':
        draft.picture1Value = action.picture1Chosen;
        return;
      case 'catchPicture2Change':
        draft.picture2Value = action.picture2Chosen;
        return;
      case 'catchPicture3Change':
        draft.picture3Value = action.picture3Chosen;
        return;
      case 'catchPicture4Change':
        draft.picture4Value = action.picture4Chosen;
        return;
      case 'catchPicture5Change':
        draft.picture5Value = action.picture5Chosen;
        return;

      case 'changeMarkerPosition':
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = '';
        draft.longititudeValue = '';
        return;

      case 'catchUploadedPictures':
        draft.uploadedPictures = action.picturesChosen;
        return;

      case 'changeSendRequest':
        draft.sendRequest = true;
        return;
      case 'catchUserProfileInfo':
        draft.userProfile.profileName = action.profileObject.profile_name;
        draft.userProfile.email = action.profileObject.email;
        return;

      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // Draggable marker
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: 'catchLatitudeChange',
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: 'catchLongitudeChange',
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  // Catching picture fields
  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: 'catchPicture1Change',
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: 'catchPicture2Change',
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: 'catchPicture3Change',
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: 'catchPicture4Change',
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: 'catchPicture5Change',
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

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
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []);

  function FormSubmit(e) {
    e.preventDefault();
    console.log('Form Submitted');
    dispatch({ type: 'changeSendRequest' });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function AddSpot() {
        const formData = new FormData();
        formData.append('title', state.titleValue);
        formData.append('description', state.descriptionValue);
        formData.append('spot_type', state.spot_typeValue);
        formData.append('conditions', state.conditionsValue);
        formData.append('latitude', state.latitudeValue);
        formData.append('longitude', state.longitudeValue);
        formData.append('beginner', state.beginnerValue);
        formData.append('intermediate', state.intermediateValue);
        formData.append('pro', state.advancedValue);
        formData.append('picture1', state.picture1Value);
        formData.append('picture2', state.picture2Value);
        formData.append('picture3', state.picture3Value);
        formData.append('picture4', state.picture4Value);
        formData.append('picture5', state.picture5Value);
        formData.append('profile', GlobalState.userId);

        try {
          const response = await Axios.post('http://localhost:8000/api/listings/create/', formData);
          // console.log(response.data);
          // Delay navigation
          setTimeout(() => {
            navigate('/map');
          }, 100);
        } catch (e) {
          console.log(e.response);
        }
      }
      AddSpot();
    }
  }, [state.sendRequest]);

  function SubmitButtonDisplay() {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.userName !== null &&
      state.userProfile.userName !== '' &&
      state.userProfile.email !== null &&
      state.userProfile.email !== ''
    ) {
      return (
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
          disabled={state.disabledBtn}
        >
          SUBMIT
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (state.userProfile.userName === null ||
        state.userProfile.userName === '' ||
        state.userProfile.email === null ||
        state.userProfile.email === '')
    ) {
      return (
        <Button
          variant='outlined'
          fullWidth
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
          onClick={() => navigate('/profile')}
        >
          COMPLETE YOUR PROFILE TO ADD A SPOT
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          variant='outlined'
          fullWidth
          onClick={() => navigate('/login')}
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
          SIGN IN TO ADD A SPOT
        </Button>
      );
    }
  }

  return (
    <Container maxWidth='xl'>
      <Box
        style={{
          width: '75%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1rem',
          padding: '1rem',
        }}
      >
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent={'center'}>
            <Typography variant='h4'>SUBMIT SPOT</Typography>
          </Grid>
          <Grid
            item
            container
            sx={{
              mt: '1rem',
            }}
          >
            <TextField
              id='title'
              label='Title'
              variant='standard'
              fullWidth
              value={state.titleValue}
              onChange={(e) => dispatch({ type: 'catchTitleChange', titleChosen: e.target.value })}
            />
          </Grid>

          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <TextField
              id='spotType'
              label='Spot Type'
              variant='standard'
              fullWidth
              value={state.spotTypeValue}
              onChange={(e) =>
                dispatch({ type: 'catchSpotTypeChange', spotTypeChosen: e.target.value })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {spotTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <TextField
              id='conditions'
              label='Surface Condition'
              variant='standard'
              fullWidth
              value={state.conditionsValue}
              onChange={(e) =>
                dispatch({ type: 'catchConditionsChange', conditionsChosen: e.target.value })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {conditionsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.beginnerValue}
                  onChange={(e) =>
                    dispatch({ type: 'catchBeginnerChange', beginnerChosen: e.target.checked })
                  }
                />
              }
              label='Beginner'
            />
          </Grid>

          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.intermediateValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchIntermediateChange',
                      intermediateChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Intermediate'
            />
          </Grid>
          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.advancedValue}
                  onChange={(e) =>
                    dispatch({ type: 'catchAdvancedChange', advancedChosen: e.target.checked })
                  }
                />
              }
              label='Advanced'
            />
          </Grid>

          <Grid item container sx={{ marginTop: '1rem' }}>
            <TextField
              id='description'
              label='Description'
              variant='outlined'
              multiline
              rows={6}
              fullWidth
              value={state.descriptionValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchDescriptionChange',
                  descriptionChosen: e.target.value,
                })
              }
            />
          </Grid>

          {/* Map */}

          <Grid item container sx={{ height: '35rem', marginTop: '2rem' }}>
            <MapContainer center={[52.52, 13.4]} zoom={11}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

                url='https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}@2x.png'
              />

              <Marker
                draggable
                eventHandlers={eventHandlers}
                position={state.markerPosition}
                ref={markerRef}
              >
                <Popup>
                  Latitude: {state.latitudeValue.toFixed(3)} <br /> Longitude:{' '}
                  {state.longitudeValue.toFixed(3)}
                </Popup>
              </Marker>
            </MapContainer>
            Latitude: {state.latitudeValue.toFixed(3)}, Longitude: {state.longitudeValue.toFixed(3)}
          </Grid>

          <Grid
            item
            container
            style={{
              marginTop: '1rem',
            }}
          >
            <Button
              variant='contained'
              component='label'
              fullWidth
              sx={{
                backgroundColor: ' #1976D2',
                fontSize: '0.8rem',
                marginTop: '1rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '15rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1988D2',
                },
                '@media (max-width: 420px)': {
                  marginTop: '3rem',
                },
              }}
            >
              UPLOAD PICTURES (MAX 5)
              <input
                type='file'
                multiple
                accept='image/png, image/gif, image/jpeg'
                hidden
                onChange={(e) =>
                  dispatch({
                    type: 'catchUploadedPictures',
                    picturesChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>

          <Grid item container justifyContent={'center'}>
            <ul>
              {state.picture1Value ? <li>{state.picture1Value.name}</li> : ''}
              {state.picture2Value ? <li>{state.picture2Value.name}</li> : ''}
              {state.picture3Value ? <li>{state.picture3Value.name}</li> : ''}
              {state.picture4Value ? <li>{state.picture4Value.name}</li> : ''}
              {state.picture5Value ? <li>{state.picture5Value.name}</li> : ''}
            </ul>
          </Grid>

          <Grid
            item
            container
            justifyContent={'center'}
            style={{
              marginTop: '-1rem',
            }}
          >
            {SubmitButtonDisplay()}
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default AddSpot;
