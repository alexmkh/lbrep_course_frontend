import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

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

// Contexts
import StateContext from "../Contexts/StateContext";

import styles from "./CSS_Modules/Profile.module.css";
import { ToastSuccess } from "../plugins/Toast";

function ProfileUpdate(props) {
  // Global state
  const GlobalState = useContext(StateContext);
  const navigate = useNavigate();

  console.log("User profile in ProfileUpdate:", props.userProfile);

  const initialState = {
    agencyNameValue: props.userProfile.agencyName || "",
    phoneNumberValue: props.userProfile.phoneNumber || "",
    bioValue: props.userProfile.bio || "",
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic || "",
    sendRequest: 0,
    disableBtn: false,
    openSnack: false,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchAgencyNameChange":
        draft.agencyNameValue = action.agencyNameChosen;
        break;
      case "catchPhoneNumberChange":
        console.log("Phone number chosen:", action.phoneNumberChosen);
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;
      case "catchBioChange":
        draft.bioValue = action.bioChosen;
        break;
      case "catchUploadedPicture":
        draft.uploadedPicture = action.picturesChosen;
        break;
      case "catchProfilePictureChange":
        draft.profilePictureValue = action.profilePictureChosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;
      case "disableTheButton":
        draft.disableBtn = true;
        break;
      case "allowTheButton":
        draft.disableBtn = false;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // Use effect to catch profile picture
  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: "catchProfilePictureChange",
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  // Use effect to send profile info to backend
  useEffect(() => {
    if (state.sendRequest) {
      const ourRequest = Axios.CancelToken.source();
      async function UpdateProfile() {
        const formData = new FormData();
        formData.append("agency_name", state.agencyNameValue);
        formData.append("phone_number", state.phoneNumberValue);
        formData.append("bio", state.bioValue);
        formData.append("seller", GlobalState.userId);
        if (
          state.profilePictureValue !== null &&
          typeof state.profilePictureValue !== "string"
        ) {
          formData.append("profile_picture", state.profilePictureValue);
        }

        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          dispatch({ type: "openTheSnack" });
              ToastSuccess()
                .fire("You have successfully updated an account!")
                .then(() => {
                  dispatch({ type: "allowTheButton" });
                  navigate(0);
                });

        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
          console.log(e);
          dispatch({ type: "allowTheButton" });
        }
      }
      UpdateProfile();
    }
  }, [state.sendRequest]);

  // useEffect(() => {
  //   if (state.openSnack) {
  //     ToastSuccess().fire("You have successfully updated an account!");
  //     const timer = setTimeout(() => {
  //       navigate(0);
  //     }, 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [state.openSnack]);

  const FormSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });

  };

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== "string") {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ""
          )}
        </ul>
      );
    } else if (typeof state.profilePictureValue === "string") {
      return (
        <Grid item className={styles.avatarGridItem}>
          <img
            src={props.userProfile.profilePic}
            className={styles.avatarImage}
          />
        </Grid>
      );
    }
  }

  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">MY PROFILE</Typography>
          </Grid>
          <Grid item container className={styles.formItem}>
            <TextField
              id="agencyName"
              label="Agency Name*"
              variant="outlined"
              fullWidth
              value={state.agencyNameValue ? state.agencyNameValue : ""}
              onChange={(e) =>
                dispatch({
                  type: "catchAgencyNameChange",
                  agencyNameChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container className={styles.formItem}>
            <TextField
              id="phoneNumber"
              label="Phone Number*"
              variant="outlined"
              fullWidth
              value={state.phoneNumberValue ? state.phoneNumberValue : ""}
              onChange={(e) =>
                dispatch({
                  type: "catchPhoneNumberChange",
                  phoneNumberChosen: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item container className={styles.formItem}>
            <TextField
              id="bio"
              label="Bio"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={state.bioValue ? state.bioValue : ""}
              onChange={(e) =>
                dispatch({
                  type: "catchBioChange",
                  bioChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container>
            {ProfilePictureDisplay()}
          </Grid>

          <Grid item container className={styles.pictureDiv} xs={6}>
            <Button
              className={styles.picturesBtn}
              variant="contained"
              component="label"
              color="primary"
              fullWidth
            >
              PROFILE PICTURE
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                hidden
                onChange={(e) =>
                  dispatch({
                    type: "catchUploadedPicture",
                    picturesChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>

          <Grid item container className={styles.submitProfileDiv} xs={8}>
            <Button
              className={styles.submitProfileBtn}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={state.disableBtn}
            >
              UPDATE
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default ProfileUpdate;
