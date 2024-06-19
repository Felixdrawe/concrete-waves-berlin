import React, { useEffect, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { produce } from 'immer';
import { Button, Grid, TextField, Typography } from '@mui/material';

// Contexts
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';
import { Global } from '@emotion/react';

function Login() {
  const navigate = useNavigate();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);

  const initialState = {
    usernameValue: '',
    passwordValue: '',
    sendRequest: false,
    token: '',
  };

  // Use Immer's produce function to create an immer-ized reducer
  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen;
        break;

      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen;
        break;

      case 'changeSendRequest':
        draft.sendRequest = true;
        return;

      case 'catchToken':
        draft.token = action.tokenValue;
        return;

      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log('form submitted');
    dispatch({ type: 'changeSendRequest' });
  }

  // SignIn
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      const signIn = async () => {
        try {
          const response = await Axios.post(
            'http://localhost:8000/api-auth-djoser/token/login/',
            {
              username: state.usernameValue,

              password: state.passwordValue,
            },
            {
              cancelToken: source.token,
            }
          );
          // console.log(response);
          dispatch({ type: 'catchToken', tokenValue: response.data.auth_token });
          GlobalDispatch({ type: 'catchToken', tokenValue: response.data.auth_token });
          // navigate('/');
        } catch (error) {
          console.log(error.response);
        }
      };
      signIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  // Get user Info
  useEffect(() => {
    if (state.token !== '') {
      const source = Axios.CancelToken.source();
      const getUserInfo = async () => {
        try {
          const response = await Axios.get(
            'http://localhost:8000/api-auth-djoser/users/me/',
            {
              headers: { Authorization: 'Token '.concat(state.token) },
            },
            {
              cancelToken: source.token,
            }
          );
          // console.log(response);
          GlobalDispatch({
            type: 'userSignsIn',
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            idInfo: response.data.id,
          });
          // Delay navigation
          setTimeout(() => {
            navigate('/');
          }, 100);
        } catch (error) {
          console.log(error.response);
        }
      };
      getUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

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
          <Typography variant='h2'>Sign in</Typography>
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
              color: 'white',
              '&:hover': {
                backgroundColor: '#82BFB5 ',
              },
            }}
          >
            Sign In
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
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: ' #649A90', cursor: 'pointer' }}
          >
            Register
          </span>
        </Typography>
      </Grid>
    </div>
  );
}

export default Login;
