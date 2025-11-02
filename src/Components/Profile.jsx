import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

import styles from "./CSS_Modules/Profile.module.css";

import API_URL, {HostURL} from "../plugins/BaseUrl";

// Assets
import defaultBusinessMan from "./Assets/defaultBusinessman.jpg";
// frontend / src / Components / Assets / defaultBusinessman.jpg;

import ProfileUpdate from "./ProfileUpdate";

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
} from "@mui/material";

function Profile() {
  // Global state
  const GlobalState = useContext(StateContext);
  const navigate = useNavigate();

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerId: "",
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
        draft.userProfile.sellerId = action.profileObject.seller;
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
          // `http://localhost:8000/api/profiles/${GlobalState.userId}/`
          API_URL(`profiles/${GlobalState.userId}/`)
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

  function PropertiesDisplay() {
    if (state.userProfile.sellerListings?.length === 0) {
      return (
        <Button disabled size="small">
          No Property
        </Button>
      );
    } else if (state.userProfile.sellerListings?.length === 1) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size="small"
        >
          One Property listed
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size="small"
        >
          {state.userProfile.sellerListings.length} Properties
        </Button>
      );
    }
  }

  // Welcome display component
  const WelcomeDisplay = () => {
    if (!state.userProfile.agencyName || !state.userProfile.phoneNumber) {
      return (
        <Typography
          variant="h5"
          align="center"
          textAlign="center"
          className={styles.formItem}
        >
          Welcome{" "}
          <span className={styles.userName}>{GlobalState.userUsername}, </span>
          please complete your profile.
        </Typography>
      );
    } else {
      return (
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
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            xs={6}
          >
            <Grid item>
              <Typography
                variant="h5"
                align="center"
                textAlign="center"
                className={styles.formItem}
              >
                Welcome back{" "}
                <span className={styles.userName}>
                  {GlobalState.userUsername}
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
                You have {PropertiesDisplay()}.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
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
    <>
      <div>{WelcomeDisplay()}</div>
      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
