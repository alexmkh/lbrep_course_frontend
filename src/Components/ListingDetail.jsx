import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultBusinessMan from "./Assets/defaultBusinessman.jpg";
import defaultAgencyImage from "./Assets/defaultAgencyImage.png";

import stadiumIconPng from "./Assets/Mapicons/stadium.png";
import universityIconPng from "./Assets/Mapicons/university.png";
import hospitalIconPng from "./Assets/Mapicons/hospital.png";

// Components
import ListingUpdate from "./ListingUpdate.jsx";
import POIPhoto from "./POIPhoto.jsx";

import API_URL, {HostURL} from "../plugins/BaseUrl";

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

// CSS Modules
import styles from "./CSS_Modules/ListingDetail.module.css";
import { ToastSuccess } from "../plugins/Toast.js";

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
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  CardActions,
  Breadcrumbs,
  Link,
  Dialog,
} from "@mui/material";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import moment from "moment";

const ListingDetail = () => {
  // Global state
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const { id } = useParams();

  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });

  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });

  const hospitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });

  const initialState = {
    dataIsLoading: true,
    listingInfo: "",
    sellerProfileInfo: "",
    disableBtn: false,
    openSnack: false,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;

      case "catchSellerProfileInfo":
        draft.sellerProfileInfo = action.profileObject;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;
      case "disableTheButton":
        draft.disableBtn = true;
        break;
      case "allowTheButton":
        draft.disableBtn = false;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // Request to get listing info
  useEffect(() => {
    const GetListingInfo = async () => {
      try {
        const response = await Axios.get(
          // `http://localhost:8000/api/listings/${id}/`
          API_URL(`listings/${id}/`)
        );
        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
        // dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
        console.log(e.response);
      }
    };
    GetListingInfo();
  }, []);

  // Request to get profile info
  useEffect(() => {
    if (!state.listingInfo) {
      return;
    }

    const GetProfileInfo = async () => {
      try {
        const response = await Axios.get(
          // `http://localhost:8000/api/profiles/${state.listingInfo.seller}/`
          API_URL(`profiles/${state.listingInfo.seller}/`)
        );
        dispatch({
          type: "catchSellerProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
        console.log("Seller:", state.sellerProfileInfo);
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
        console.log(e);
      }
    };
    GetProfileInfo();
  }, [state.listingInfo]);

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    if (currentPicture === listingPictures.length - 1) {
      return setCurrentPicture(0);
    } else {
      return setCurrentPicture(currentPicture + 1);
    }
  }

  function PreviousPicture() {
    if (currentPicture === 0) {
      return setCurrentPicture(listingPictures.length - 1);
    } else {
      return setCurrentPicture(currentPicture - 1);
    }
  }

  async function DeleteHandler() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirmDelete) {
      dispatch({ type: "disableTheButton" });
      try {
        const response = await Axios.delete(
          // `http://localhost:8000/api/listings/${id}/delete/`,
          API_URL(`listings/${id}/delete/`),
          {
            headers: { Authorization: `Bearer ${GlobalState.userToken}` },
          }
        );
        console.log("Listing deleted");
        ToastSuccess().fire("You have successfully deleted your property.").then(() => {
          dispatch({ type: "allowTheButton" });
          navigate("/listings");
        })

      } catch (e) {
        dispatch({ type: "allowTheButton" });
        console.log("There was a problem or the request was cancelled.");
        console.log(e.response.data);
      }
    }
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (state.dataIsLoading) {
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
    <div
      style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}
    >
      <Grid item style={{ marginTop: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/listings")}
            style={{ cursor: "pointer" }}
          >
            Listings
          </Link>
          <Typography sx={{ color: "text.primary" }}>
            {state.listingInfo.title}
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Image slider */}
      {listingPictures.length > 0 ? (
        <Grid
          item
          container
          justifyContent="center"
          className={styles.sliderContainer}
        >
          {listingPictures.map((picture, index) => {
            return (
              <div key={index}>
                {index === currentPicture ? (
                  <img src={picture} className={styles.picture} />
                ) : (
                  ""
                )}
              </div>
            );
          })}

          <ArrowCircleLeftIcon
            onClick={PreviousPicture}
            className={styles.sliderArrowLeft}
          />
          <ArrowCircleRightIcon
            onClick={NextPicture}
            className={styles.sliderArrowRight}
          />
        </Grid>
      ) : (
        ""
      )}

      {/* More information about the listing */}

      <Grid item container className={styles.listingInfoContainer}>
        <Grid item container xs={7} direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h5"> {state.listingInfo.title} </Typography>
          </Grid>
          <Grid item>
            <RoomIcon fontSize="small" />{" "}
            <Typography variant="h6">
              {" "}
              {state.listingInfo.borough} borough{" "}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" color="textSecondary">
              Posted on{" "}
              {moment(state.listingInfo.date_posted).format(
                "MMMM Do YYYY, h:mm a"
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={5} alignItems="center">
          <Typography variant="h6" className={styles.priceText}>
            {" "}
            {state.listingInfo.listing_type} |{" "}
            {state.listingInfo.property_status === "Sale"
              ? `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                  state.listingInfo.rental_frequency
                }`}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justifyContent="flex-start"
        className={styles.listingInfoContainer}
      >
        {state.listingInfo.rooms ? (
          <Grid item xs={2} className={styles.optionTag}>
            <Typography variant="h6">
              {state.listingInfo.rooms} Rooms
            </Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.furnished ? (
          <Grid item xs={2} className={styles.optionTag}>
            <CheckBoxIcon className={styles.checkBoxIcon} />{" "}
            <Typography variant="h6">Furnished</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.pool ? (
          <Grid item xs={2} className={styles.optionTag}>
            <CheckBoxIcon className={styles.checkBoxIcon} />{" "}
            <Typography variant="h6">Pool</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.elevator ? (
          <Grid item xs={2} className={styles.optionTag}>
            <CheckBoxIcon className={styles.checkBoxIcon} />{" "}
            <Typography variant="h6">Elevator</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.cctv ? (
          <Grid item xs={2} className={styles.optionTag}>
            <CheckBoxIcon className={styles.checkBoxIcon} />{" "}
            <Typography variant="h6">Cctv</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.parking ? (
          <Grid item xs={2} className={styles.optionTag}>
            <CheckBoxIcon className={styles.checkBoxIcon} />{" "}
            <Typography variant="h6">Parking</Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {/* Description */}
      {state.listingInfo.description && (
        <Grid item className={styles.listingInfoContainer}>
          <Typography variant="h5">Description</Typography>
          <Typography variant="h6">{state.listingInfo.description}</Typography>
        </Grid>
      )}

      {/* Seller info */}
      <Grid container className={styles.welcomeBackContainer}>
        <Grid item xs={6} className={styles.profileImageDiv}>
          <img
            src={
              state.sellerProfileInfo.profile_picture
                ? state.sellerProfileInfo.profile_picture
                : // : "https://via.placeholder.com/150"
                  defaultBusinessMan
            }
            alt="Profile"
            className={styles.profileImage}
            onClick={() =>
              navigate(`/agencies/${state.sellerProfileInfo.seller}`)
            }
            // style={{ cursor: "pointer" }}
          />
        </Grid>
        <Grid item container direction="column" justifyContent="center" xs={6}>
          <Grid item>
            <Typography
              variant="h5"
              align="center"
              textAlign="center"
              className={styles.formItem}
            >
              <span className={styles.userName}>
                {state.sellerProfileInfo.agency_name}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              align="center"
              textAlign="center"
              className={styles.formItem}
            >
              <IconButton>
                <LocalPhoneIcon /> {state.sellerProfileInfo.phone_number}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid item className={styles.bioSection}>
          {state.sellerProfileInfo.bio && state.sellerProfileInfo.bio}
        </Grid> */}
        {GlobalState.userId == state.listingInfo.seller ? (
          <Grid
            item
            container
            justifyContent="space-around"
            className={styles.buttonContainer}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Update
            </Button>
            <Button variant="contained" color="error" onClick={DeleteHandler} disabled={state.disableBtn}>
              Delete
            </Button>
            <Dialog open={open} onClose={handleClose} fullScreen>
              <ListingUpdate
                listingData={state.listingInfo}
                closeDialog={handleClose}
              />
            </Dialog>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {/* Map */}
      <Grid
        item
        container
        className={styles.mapContainer}
        spacing={1}
        justifyContent="space-between"
      >
        <Grid item xs={3} className={styles.poisContainer}>
          {state.listingInfo.listing_pois_within_10km.length > 0 ? (
            <div>
              <Typography variant="h5" className={styles.poisTitle}>
                Points of Interest
              </Typography>
              {state.listingInfo.listing_pois_within_10km.map((poi) => {
                function DegreeToRadians(degrees) {
                  return (degrees * Math.PI) / 180;
                }
                // Calculate distance from listing to poi by the formula
                function CalculateDistance() {
                  const latitude1 = DegreeToRadians(state.listingInfo.latitude);
                  const longitude1 = DegreeToRadians(
                    state.listingInfo.longitude
                  );
                  const latitude2 = DegreeToRadians(
                    poi.location.coordinates[0]
                  );
                  const longitude2 = DegreeToRadians(
                    poi.location.coordinates[1]
                  );
                  // The formula
                  const latDiff = latitude2 - latitude1;
                  const lonDiff = longitude2 - longitude1;
                  const R = 6371000 / 1000;

                  const a =
                    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                    Math.cos(latitude1) *
                      Math.cos(latitude2) *
                      Math.sin(lonDiff / 2) *
                      Math.sin(lonDiff / 2);
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                  const d = R * c;

                  const dist =
                    Math.acos(
                      Math.sin(latitude1) * Math.sin(latitude2) +
                        Math.cos(latitude1) *
                          Math.cos(latitude2) *
                          Math.cos(lonDiff)
                    ) * R;
                  return dist.toFixed(2);
                }
                return (
                  <div key={poi.id} className={styles.poiItem}>
                    <Typography variant="h6"> {poi.name} </Typography>
                    <Typography variant="subtitle1">
                      {poi.type} |{" "}
                      <span className={styles.distanceToPoi}>
                        {CalculateDistance()} Kilometers
                      </span>
                    </Typography>
                  </div>
                );
              })}
            </div>
          ) : (
            <Typography variant="h6">
              No points of interest within 10 km.
            </Typography>
          )}
        </Grid>
        <Grid item xs={9} className={styles.mapDiv}>
          <MapContainer
            className={styles.map}
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                state.listingInfo.latitude,
                state.listingInfo.longitude,
              ]}
            >
              <Popup>{state.listingInfo.title}</Popup>
            </Marker>
            {/* Add more markers for points of interest if available */}
            {state.listingInfo.listing_pois_within_10km.map((poi) => {
              function PoiIcon() {
                if (poi.type === "Stadium") {
                  return stadiumIcon;
                } else if (poi.type === "Hospital") {
                  return hospitalIcon;
                } else if (poi.type === "University") {
                  return universityIcon;
                }
              }
              return (
                <Marker
                  key={poi.id}
                  position={[
                    poi.location.coordinates[0],
                    poi.location.coordinates[1],
                  ]}
                  icon={PoiIcon()}
                >
                  <Popup>
                    <POIPhoto POI_Name={poi.name}/>
                    {poi.name}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default ListingDetail;
