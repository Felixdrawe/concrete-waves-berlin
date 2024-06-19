import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useMemo,
} from 'react';
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
} from '@mui/material';

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

function ListingUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: props.listingData.title,
    descriptionValue: props.listingData.description,
    spot_typeValue: props.listingData.spot_type,
    conditionsValue: props.listingData.conditions,

    beginnerValue: props.listingData.beginner,
    intermediateValue: props.listingData.intermediate,
    advancedValue: props.listingData.pro,

    sendRequest: false,
    userProfile: {
      profileName: '',
      email: '',
    },
  };

  // Use Immer's produce function to create an immer-ized reducer
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

      case 'changeSendRequest':
        draft.sendRequest = true;
        return;

      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log('Form Submitted');
    dispatch({ type: 'changeSendRequest' });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function UpdateSpot() {
        const formData = new FormData();
        formData.append('title', state.titleValue);
        formData.append('description', state.descriptionValue);
        formData.append('spot_type', state.spot_typeValue);
        formData.append('conditions', state.conditionsValue);
        formData.append('beginner', state.beginnerValue);
        formData.append('intermediate', state.intermediateValue);
        formData.append('pro', state.advancedValue);

        formData.append('profile', GlobalState.userId);

        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/listings/${props.listingData.id}/update/`,
            formData
          );
          // console.log(response.data);
          // Delay navigation
          setTimeout(() => {
            navigate(0);
          }, 100);
        } catch (e) {
          console.log(e.response);
        }
      }
      UpdateSpot();
    }
  }, [state.sendRequest]);

  return (
    <div
      style={{
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '12rem',
        padding: '3rem',
      }}
    >
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent={'center'}>
          <Typography variant='h3'>UPDATE SPOT</Typography>
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
            onChange={(e) =>
              dispatch({
                type: 'catchTitleChange',
                titleChosen: e.target.value,
              })
            }
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
              dispatch({
                type: 'catchSpotTypeChange',
                spotTypeChosen: e.target.value,
              })
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
              dispatch({
                type: 'catchConditionsChange',
                conditionsChosen: e.target.value,
              })
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
                  dispatch({
                    type: 'catchBeginnerChange',
                    beginnerChosen: e.target.checked,
                  })
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
                  dispatch({
                    type: 'catchAdvancedChange',
                    advancedChosen: e.target.checked,
                  })
                }
              />
            }
            label='Pro'
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
            fullWidth
            type='submit'
            sx={{
              width: '100%',
              maxWidth: 360,
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
            disabled={state.disabledBtn}
          >
            UPDATE
          </Button>
        </Grid>
      </form>
      <Grid item container justifyContent={'center'} sx={{ mt: '1rem' }}>
        <Button
          variant='contained'
          onClick={props.closeDialog}
          sx={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          }}
        >
          Cancel
        </Button>
      </Grid>
    </div>
  );
}

export default ListingUpdate;
