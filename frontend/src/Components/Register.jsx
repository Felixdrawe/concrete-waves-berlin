import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import Axios from 'axios';
import { produce } from 'immer';

// Define your initial state outside the component for clarity
const initialState = {
  usernameValue: '',
  emailValue: '',
  passwordValue: '',
  password2Value: '',
  sendRequest: false, // It's generally better to use a boolean for flags
};

// Use Immer's produce function to create an immer-ized reducer
const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'catchUsernameChange':
      draft.usernameValue = action.usernameChosen;
      return;
    case 'catchEmailChange':
      draft.emailValue = action.emailChosen;
      return;
    case 'catchPasswordChange':
      draft.passwordValue = action.passwordChosen;
      return;
    case 'catchPassword2Change':
      draft.password2Value = action.password2Chosen;
      return;
    case 'changeSendRequest':
      draft.sendRequest = true;
      return;
    // Don't forget to handle default case
    default:
      return;
  }
});

function Register() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log('Form Submitted');
    dispatch({ type: 'changeSendRequest' });
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      const signUp = async () => {
        try {
          const response = await Axios.post(
            'http://localhost:8000/api-auth-djoser/users/',
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value,
            },
            {
              cancelToken: source.token,
            }
          );
          // console.log('response', response.data);
          navigate('/');
        } catch (error) {
          console.log(error.response);
        }
      };
      signUp();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  return (
    <div
      style={{
        maxWidth: '25rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '1rem',
        padding: '1rem',
      }}
    >
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent={'center'}>
          <Typography
            variant='h2'
            sx={{
              textAlign: 'center',
            }}
          >
            Create Account
          </Typography>
        </Grid>
        <Grid
          item
          container
          sx={{
            mt: '1rem',
          }}
        >
          <TextField
            id='username'
            label='Username'
            variant='outlined'
            fullWidth
            value={state.usernameValue}
            onChange={(e) =>
              dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })
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
            label='Email'
            variant='outlined'
            fullWidth
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
            id='password'
            label='Password'
            variant='outlined'
            fullWidth
            type='password'
            value={state.passwordValue}
            onChange={(e) =>
              dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })
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
            id='password2'
            label='Confirm Password'
            variant='outlined'
            fullWidth
            type='password'
            value={state.password2Value}
            onChange={(e) =>
              dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })
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
            Sign Up
          </Button>
        </Grid>
      </form>

      <Grid
        item
        container
        justifyContent={'center'}
        style={{
          marginTop: '1rem',
        }}
      >
        <Typography variant='small'>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#649A90', cursor: 'pointer' }}>
            Sign in
          </span>
        </Typography>
      </Grid>
    </div>
  );
}

export default Register;
