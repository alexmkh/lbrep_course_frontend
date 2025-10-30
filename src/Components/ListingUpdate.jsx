import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Context
import StateContext from "../Contexts/StateContext";

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

// Custom imports
import styles from "./CSS_Modules/ListingUpdate.module.css";
import { ToastSuccess } from "../plugins/Toast";

const listingTypeOptions = [
  { value: "", label: "" },
  { value: "Apartment", label: "Apartment" },
  { value: "House", label: "House" },
  { value: "Office", label: "Office" },
];

const propertyStatusOptions = [
  { value: "", label: "" },
  { value: "Sale", label: "Sale" },
  { value: "Rent", label: "Rent" },
];

const rentalFrequencyOptions = [
  { value: "", label: "" },
  { value: "Month", label: "Month" },
  { value: "Week", label: "Week" },
  { value: "Day", label: "Day" },
];

function ListingUpdate({ listingData, closeDialog }) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const URL = `http://localhost:8000/api/listings/${listingData.id}/update/`;

  const initialState = {
    titleValue: listingData.title || "",
    listingTypeValue: listingData.listing_type || "",
    descriptionValue: listingData.description || "",
    propertyStatusValue: listingData.property_status || "",
    priceValue: listingData.price || "",
    rentalFrequencyValue: listingData.rental_frequency || "",
    roomsValue: listingData.rooms || "",
    furnishedValue: listingData.furnished || false,
    poolValue: listingData.pool || false,
    elevatorValue: listingData.elevator || false,
    cctvValue: listingData.cctv || false,
    parkingValue: listingData.parking || false,
    sendRequest: 0,
    disableBtn: false,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;
      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        break;
      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        break;
      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;
      case "catchRoomsChange":
        draft.roomsValue = action.roomsChosen;
        break;
      case "catchFurnishedChange":
        draft.furnishedValue = action.furnishedChosen;
        break;
      case "catchPoolChange":
        draft.poolValue = action.poolChosen;
        break;
      case "catchElevatorChange":
        draft.elevatorValue = action.elevatorChosen;
        break;
      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;
      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
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

  const FormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
    // ToastSuccess().fire("Your property is being updated...").then(() => {
    //   // navigate(0);
    // });
  };

  // Use effect to send the form data to the backend
  useEffect(() => {
    if (state.sendRequest) {
      const ourRequest = Axios.CancelToken.source();
      async function UpdateProperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("price", state.priceValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("rooms", state.listingTypeValue === "Office" ? 0 : state.roomsValue);
        formData.append("furnished", state.furnishedValue);
        formData.append("pool", state.poolValue);
        formData.append("elevator", state.elevatorValue);
        formData.append("cctv", state.cctvValue);
        formData.append("parking", state.parkingValue);
        formData.append("seller", GlobalState.userId);

        try {
          const response = await Axios.patch(URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            // withCredentials: true,
            cancelToken: ourRequest.token,
          });
          ToastSuccess().fire("You have successfully updated your property.").then(() => {
            dispatch({ type: "allowTheButton" });
            navigate(0);
          });
          // console.log("Response data received");
          // console.log(response.data);
          // navigate(0);
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
          console.log(e);
        }

      }
      UpdateProperty();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendRequest]);

  const PriceDisplay = () => {
    if (state.propertyStatusValue === "Rent" && state.rentalFrequencyValue) {
      return "Price (per " + state.rentalFrequencyValue + ")*";
    } else {
      return "Price*";
    }
  };

  // Draggable marker
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  return (
    <div className={styles.formContainer}>
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">SUBMIT A PROPERTY</Typography>
        </Grid>
        <Grid item container className={styles.formItem}>
          <TextField
            id="title"
            label="Title*"
            variant="standard"
            fullWidth
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          {/* Listing Type */}
          <Grid item className={styles.formItemSideBySide}>
            <TextField
              id="listingType"
              label="Listing Type*"
              variant="standard"
              fullWidth
              value={state.listingTypeValue}
              onChange={(e) =>
                dispatch({
                  type: "catchListingTypeChange",
                  listingTypeChosen: e.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          {/* Property Status */}
          <Grid item className={styles.formItemSideBySide}>
            <TextField
              id="propertyStatus"
              label="Property Status*"
              variant="standard"
              fullWidth
              value={state.propertyStatusValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPropertyStatusChange",
                  propertyStatusChosen: e.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {propertyStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          <Grid item container className={styles.formItemSideBySide}>
            <TextField
              id="rentalFrequency"
              label="Rental Frequency"
              variant="standard"
              disabled={state.propertyStatusValue === "Sale"}
              fullWidth
              value={state.rentalFrequencyValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRentalFrequencyChange",
                  rentalFrequencyChosen: e.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {rentalFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          {/* Price */}
          <Grid item container className={styles.formItemSideBySide}>
            <TextField
              id="price"
              type="number"
              label={PriceDisplay()}
              variant="standard"
              fullWidth
              value={state.priceValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPriceChange",
                  priceChosen: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>

        {/* Rental Frequency */}

        <Grid item container className={styles.formItem}>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            value={state.descriptionValue}
            onChange={(e) =>
              dispatch({
                type: "catchDescriptionChange",
                descriptionChosen: e.target.value,
              })
            }
          />
        </Grid>

        {state.listingTypeValue === "Office" ? (
          ""
        ) : (
          <Grid item xs={3} container sx={{ marginTop: "1rem" }}>
            <TextField
              id="rooms"
              label="Rooms"
              type="number"
              variant="standard"
              fullWidth
              value={state.roomsValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRoomsChange",
                  roomsChosen: e.target.value,
                })
              }
            />
          </Grid>
        )}

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={2} className={styles.formItemSideBySide}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.furnishedValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchFurnishedChange",
                      furnishedChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Furnished"
            />
          </Grid>

          <Grid item xs={2} className={styles.formItemSideBySide}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.poolValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchPoolChange",
                      poolChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Pool"
            />
          </Grid>

          <Grid item xs={2} className={styles.formItemSideBySide}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.elevatorValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchElevatorChange",
                      elevatorChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Elevator"
            />
          </Grid>

          <Grid item xs={2} className={styles.formItemSideBySide}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.cctvValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchCctvChange",
                      cctvChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Cctv"
            />
          </Grid>

          <Grid item xs={2} className={styles.formItemSideBySide}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.parkingValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchParkingChange",
                      parkingChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Parking"
            />
          </Grid>
        </Grid>

        <Grid item container className={styles.registerDiv} xs={8}>
          <Button
            className={styles.registerBtn}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={state.disableBtn}
          >
            UPDATE
          </Button>
          <Button
            className={styles.cancelBtn}
            variant="contained"
            color="secondary"
            onClick={closeDialog}
            fullWidth
          >
            CANCEL
          </Button>
        </Grid>
      </form>
    </div>
  );
}

export default ListingUpdate;
