import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// import styles from "./CSS_Modules/Profile.module.css";

// Assets
import defaultBusinessMan from "./Assets/defaultBusinessman.jpg";
import defaultAgencyImage from "./Assets/defaultAgencyImage.png";
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
  CardActions,
  CircularProgress,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Agencies = () => {
  // Global state
  const GlobalState = useContext(StateContext);
  const navigate = useNavigate();

  const initialState = {
    dataIsLoading: true,
    agenciesList: [],
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchAgencies":
        draft.agenciesList = action.agenciesArray;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // Request to get all profiles
  useEffect(() => {
    const GetAgencies = async () => {
      try {
        const response = await Axios.get(`http://localhost:8000/api/profiles/`);
        dispatch({
          type: "catchAgencies",
          agenciesArray: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
        console.log(e.response);
      }
    };
    GetAgencies();
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
    <Grid
      container
      justifyContent="flex-start"
      spacing={2}
      style={{ padding: "10px" }}
    >
      {state.agenciesList.map((agency) => {
        
        function PropertiesDisplay() {
          if (agency.seller_listings.length === 0) {
            return (
              <Button disabled size="small">
                No Property
              </Button>
            );
          } else if (agency.seller_listings.length === 1) {
            return (
              <Button
                size="small"
                onClick={() => navigate(`/agencies/${agency.seller}`)}
              >
                One Property listed
              </Button>
            );
          } else {
            return (
              <Button
                size="small"
                onClick={() => navigate(`/agencies/${agency.seller}`)}
              >
                {agency.seller_listings.length} Properties
              </Button>
            );
          }
        }

        // Only display agencies with a name and phone number
        if (agency.agency_name && agency.phone_number)
          return (
            <Grid
              key={agency.id}
              item
              style={{ marginTop: "1rem", maxWidth: "20rem" }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    agency.profile_picture
                      ? agency.profile_picture
                      : defaultAgencyImage
                  }
                  alt="Profile Picture"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {agency.agency_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agency.bio.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>{PropertiesDisplay()}</CardActions>
              </Card>
            </Grid>
          );
      })}
    </Grid>
  );
};

export default Agencies;
