import React, { useEffect, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { produce } from 'immer';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme'; 

// Components
import Home from './Components/Home';
import Login from './Components/Login';
import Map from './Components/Map';
import Header from './Components/Header';
import Register from './Components/Register';
import AddSpot from './Components/AddSpot';
import Profile from './Components/Profile';
import ProfilesList from './Components/ProfilesList';
import ProfileDetail from './Components/ProfileDetail';
import ListingDetail from './Components/ListingDetail';
import MapFavs from './Components/MapFavs';

// Contexts
import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';


// App Component
function App() {
  const initialState = {
    userUsername: localStorage.getItem('theUserUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: localStorage.getItem('theUserUsername') ? true : false,
  };

  const reducer = produce((draft, action) => {
    switch (action.type) {
      case 'catchToken':
        draft.userToken = action.tokenValue;
        break;
      case 'userSignsIn':
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.idInfo;
        draft.userIsLogged = true;
        break;

      case 'logout':
        draft.userIsLogged = false;
        break;

      default:
        return;
    }
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('theUserUsername', state.userUsername);
      localStorage.setItem('theUserEmail', state.userEmail);
      localStorage.setItem('theUserId', state.userId);
      localStorage.setItem('theUserToken', state.userToken);
    } else {
      localStorage.removeItem('theUserUsername');
      localStorage.removeItem('theUserEmail');
      localStorage.removeItem('theUserId');
      localStorage.removeItem('theUserToken');
    }
  }, [state.userIsLogged]);

  return (
    <ThemeProvider theme={theme}> 
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <CssBaseline /> 
            <Header />
            <div className='main-content'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/map' element={<Map />} />
                <Route path='/map-favs' element={<MapFavs />} />
                <Route path='/add-spot' element={<AddSpot />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/profiles-list' element={<ProfilesList />} />
                <Route path='/profiles-list/:id' element={<ProfileDetail />} />
                <Route path='/listings/:id' element={<ListingDetail />} />
              </Routes>
            </div>
          </BrowserRouter>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </ThemeProvider>
  );
}

export default App;
