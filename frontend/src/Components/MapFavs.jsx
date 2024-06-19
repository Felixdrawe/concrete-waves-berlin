import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { produce } from 'immer';
import { useContext } from 'react';

import StateContext from '../Contexts/StateContext';



// Material UI
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  CardActions,
  Box,
  Container,
} from '@mui/material';

import RoomIcon from '@mui/icons-material/Room';

// React Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Map Icons
import bowlIcon from '../Assets/Mapicons/bowl.svg';
import flatIcon from '../Assets/Mapicons/flat.svg';
import pumptrackIcon from '../Assets/Mapicons/pumptrack.svg';
import skateparkIcon from '../Assets/Mapicons/skatepark.svg';

const initialState = {
  mapInstance: null,
};

// Use Immer's produce function to create an immer-ized reducer
const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'getMap':
      draft.mapInstance = action.mapData;
      return;
    default:
      return;
  }
});

// Function to handle button click to Google
const handleButtonClick = (lat, lng) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(googleMapsUrl, '_blank');
};

// Create an icon instance
const bowlIconDisplay = L.icon({
  iconUrl: bowlIcon,
  iconSize: [50, 50],
});

const flatIconDisplay = L.icon({
  iconUrl: flatIcon,
  iconSize: [50, 50],
});

const pumptrackIconDisplay = L.icon({
  iconUrl: pumptrackIcon,
  iconSize: [50, 50],
});

const skateparkIconDisplay = L.icon({
  iconUrl: skateparkIcon,
  iconSize: [50, 50],
});

function getIconForSpotType(spotType) {
  switch (spotType) {
    case 'Flat':
      return flatIconDisplay;
    case 'Skatepark':
      return skateparkIconDisplay;
    case 'Pumptrack':
      return pumptrackIconDisplay;

    case 'Bowl':
      return bowlIconDisplay;

    default:
      return skateparkIconDisplay;
  }
}

////////////////////////////////// Map Component //////////////////////////////////
function Map() {
  const [allListings, setAllListings] = useState([]);
  const [dataisLoading, setDataisLoading] = useState(true);
  const GlobalState = useContext(StateContext);
  // console.log(GlobalState);

  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: 'getMap', mapData: map });
    return null;
  }


  useEffect(() => {
    const source = Axios.CancelToken.source();
    
    async function getAllListings() {
      try {
        const response = await Axios.get('http://localhost:8000/api/listings', {
          cancelToken: source.token,
        });
        
        // Filter listings to only include favorites of the logged-in user
        const userFavorites = response.data.filter(listing => {
          return listing.favorites.some(favorite => favorite.user === parseInt(GlobalState.userId));
        });
        
        setAllListings(userFavorites);
        setDataisLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    }
    
    getAllListings();
    
    return () => {
      source.cancel();
    };
  }, []);
  
  

  

  return (
    <Container maxWidth='xl'>
      <Grid container spacing={2} marginTop={0.1}>
        {/* Cards Section */}
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}
          >
            {allListings.map((listing) => (
              <Card
                key={listing.id}
                sx={{
                  width: { xs: 'calc(50% - 16px)', md: '100%' },
                  marginBottom: '0.5rem',
                  border: '1px solid grey',
                  position: 'relative',
                }}
              >
                <CardHeader
                  action={
                    <IconButton
                      aria-label='settings'
                      onClick={() =>
                        state.mapInstance.flyTo([listing.latitude, listing.longitude], 16)
                      }
                    >
                      <RoomIcon />
                    </IconButton>
                  }
                  title={listing.title}
                />
                <CardMedia
                  component='img'
                  image={listing.picture1}
                  alt={listing.title}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  sx={{
                    height: '200px', // Standardized height
                    cursor: 'pointer',
                  }}
                />
                <CardContent>
                  <Typography variant='body2'>{listing.description.substring(0, 80)}...</Typography>
                </CardContent>
                <Typography
                  sx={{
                    position: 'absolute',
                    backgroundColor: 'rgb(25,118,210)',
                    zIndex: '1000',
                    color: 'white',
                    top: '100px',
                    left: '20px',
                    padding: '5px',
                  }}
                >
                  {listing.spot_type}
                </Typography>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={9}>
          <AppBar position='sticky'>
            <MapContainer
              center={[52.52, 13.4]}
              zoom={11}
              scrollWheelZoom={true}
              style={{
                height: '85vh', // Full height by default

                width: '100%',
              }}
            >
              <TileLayer
                // attribution= '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url='https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}@2x.png'
                // url='https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png'
                // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <TheMapComponent />
              {allListings.map((listing) => (
                <Marker
                  key={listing.id}
                  icon={getIconForSpotType(listing.spot_type)}
                  position={[listing.latitude, listing.longitude]}
                >
                  <Popup>
                    <div style={{ width: '250px' }}>
                      {' '}
                      {/* Set the maximum width */}
                      <img
                        src={listing.picture1}
                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      />
                      <h3>{listing.title}</h3>
                      <p>{listing.description.substring(0, 150)}...</p>
                      <Button
                        variant='contained'
                        fullWidth
                        size='small'
                        style={{ marginTop: '8px' }}
                        onClick={() => handleButtonClick(listing.latitude, listing.longitude)}
                      >
                        Show on Google
                      </Button>
                      <Button
                        variant='contained'
                        fullWidth
                        size='small'
                        style={{ marginTop: '8px' }}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </AppBar>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Map;
