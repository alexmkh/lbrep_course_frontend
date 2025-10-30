import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import moment from "moment";

// React leaflet
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polyline,
  Polygon,
} from "react-leaflet";
import { Icon } from "leaflet";

// MUI imports
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
} from "@mui/material";

// Map icons
import houseIconPng from "./Assets/Mapicons/house.png";
import apartmentIconPng from "./Assets/Mapicons/apartment.png";
import officeIconPng from "./Assets/Mapicons/office.png";

// Assets
import img1 from "./Assets/img1.jpg";
import myListings from "./Assets/Data/Dummydata";

import styles from "./CSS_Modules/Listings.module.css";
import RoomIcon from "@mui/icons-material/Room";

function Listings() {

  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });

  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });

  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });

  const navigate = useNavigate();

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  const initialState = {
    mapInstance: null,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "getMap":
        draft.mapInstance = action.mapData;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
  const TheMapComponent = () => {
    const map = useMap();
    dispatch({
      type: "getMap",
      mapData: map,
    });
    return null;
  };

  useEffect(() => {
    const source = Axios.CancelToken.source();
    // Fetch listings from the backend API
    const GetAllListings = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:8000/api/listings/",
          { cancelToken: source.token }
        );
        // console.log(response.data);
        // You can set the fetched data to state if needed
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    GetAllListings();
    return () => {
      source.cancel("Component unmounted, request cancelled");
    };
  }, []);

  if (dataIsLoading === false) {
    console.log("Listings data fetched successfully:", allListings[0].location);
  }

  if (dataIsLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />;
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        {allListings.map((listing) => {
          return (
            <Card className={styles.cardStyle} key={listing.id}>
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() =>
                      state.mapInstance.flyTo(
                        [listing.latitude, listing.longitude],
                        16
                      )
                    }
                  >
                    <RoomIcon />
                  </IconButton>
                }
                title={listing.title}
              />
              <CardMedia
                className={styles.pictureStyle}
                component="img"
                // height="194"
                image={listing.picture1}
                alt={listing.title}
                onClick={() => navigate(`/listings/${listing.id}`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 200)}...
                </Typography>
                {listing.property_status === "Sale" ? (
                  <Typography className={styles.priceOverlay}>
                    {listing.listing_type}: $
                    {listing.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Typography>
                ) : (
                  <Typography className={styles.priceOverlay}>
                    {`${listing.listing_type}: $
									${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${" "}
									/ ${listing.rental_frequency}`}
                  </Typography>
                )}

                <CardActions disableSpacing>
                  <IconButton area-label="add to favorites">
                    {`Posted by ${listing.seller_agency_name || listing.seller_username}`}
                  </IconButton>
                </CardActions>
                <Typography variant="body2" color="textSecondary">
                  {`on ${moment(listing.date_posted).format("MMMM Do YYYY")}`}
                </Typography>

              </CardContent>
            </Card>
          );
        })}
      </Grid>

      <Grid item xs={8}>
        <AppBar position="sticky" style={{ margin: "0.5rem" }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TheMapComponent />

            {allListings.map((listing) => {
              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longitude]}
                  icon={
                    listing.listing_type === "House"
                      ? houseIcon
                      : listing.listing_type === "Apartment"
                      ? apartmentIcon
                      : officeIcon
                  }
                >
                  <Popup>
                    <Typography variant="h5">{listing.title}</Typography>
                    <img
                      src={listing.picture1}
                      alt={listing.title}
                      style={{ height: "14rem", width: "18rem", cursor: "pointer" }}
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    />
                    <Typography variant="body1">
                      {listing.description.substring(0, 150)}...
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      Details
                    </Button>
                  </Popup>
                </Marker>
              );
            })}

            {/* <Marker icon={officeIcon} position={[latitude, longitude]}>
              <Popup>
                <Typography variant="h5">A title</Typography>
                <img
                  src={img1}
                  alt="Example"
                  style={{ height: "14rem", width: "18rem" }}
                />
                <Typography variant="body1">
                  This is some text below the title
                </Typography>
                <Button variant="contained" fullWidth>
                  A Link
                </Button>
              </Popup>
            </Marker> */}
          </MapContainer>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Listings;
