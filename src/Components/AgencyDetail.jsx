import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultBusinessMan from "./Assets/defaultBusinessman.jpg";
import defaultAgencyImage from "./Assets/defaultAgencyImage.png";

import API_URL, {HostURL} from "../plugins/BaseUrl";


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
} from "@mui/material";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

import styles from "./CSS_Modules/AgencyDetail.module.css";

function Profile() {
  // Global state
  const GlobalState = useContext(StateContext);
  const navigate = useNavigate();

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      bio: "",
      profilePic: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };
}

const AgencyDetail = () => {
  // Global state
  const GlobalState = useContext(StateContext);
  const navigate = useNavigate();

  const { id } = useParams();

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      bio: "",
      profilePic: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // Request to get profile info
  useEffect(() => {
    const GetProfileInfo = async () => {
      try {
        const response = await Axios.get(
          // `http://localhost:8000/api/profiles/${id}/`
          API_URL(`profiles/${id}/`)
        );
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
        console.log(e.response);
      }
    };
    GetProfileInfo();
  }, []);

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
    <div>
      {" "}
      <Grid container className={styles.welcomeBackContainer}>
        <Grid item xs={6} className={styles.profileImageDiv}>
          <img
            src={
              state.userProfile.profilePic
                ? state.userProfile.profilePic
                : // : "https://via.placeholder.com/150"
                  defaultBusinessMan
            }
            alt="Profile"
            className={styles.profileImage}
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
                {state.userProfile.agencyName}
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
                <LocalPhoneIcon /> {state.userProfile.phoneNumber}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        <Grid item className={styles.bioSection}>
          {state.userProfile.bio && state.userProfile.bio}
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="flex-start"
        spacing={2}
        style={{ padding: "10px" }}
      >
        {state.userProfile.sellerListings.map((listing) => {

            return (
              <Grid
                key={listing.id}
                item
                style={{ marginTop: "1rem", maxWidth: "20rem" }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      // `http://localhost:8000${listing.picture1}`
                      //   ? `http://localhost:8000${listing.picture1}`
                      //   : defaultAgencyImage
                      `${HostURL()}${listing.picture1}`
                      ? `${HostURL()}${listing.picture1}`
                      : defaultAgencyImage
                    }
                    alt="Listing Picture"
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {listing.property_status === "Sale"
                      ? `${listing.listing_type}: $${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : `${listing.listing_type}: $${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                          listing.rental_frequency
                        }`}
                  </CardActions>
                </Card>
              </Grid>
            );
        })}
      </Grid>
    </div>
  );
};

export default AgencyDetail;
