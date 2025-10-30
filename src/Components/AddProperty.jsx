import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

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

// Context
import StateContext from "../Contexts/StateContext";

import { ToastSuccess } from "../plugins/Toast";

import { useGeoData } from "./GeoDataContext";


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
  Snackbar,
  Alert,
} from "@mui/material";

// Custom imports
import styles from "./CSS_Modules/AddProperty.module.css";

let areaOptions = [
  { value: "", label: "" },
  // { value: "Inner London", label: "Inner London" },
  // { value: "Outer London", label: "Outer London" },
];
let boroughOptions = [];

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

function AddProperty() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const URL = "http://localhost:8000/api/listings/create/";

  const {
    geoData,
    geoDataAreLoading,
    geoDataError,
    reloadGeoData,
  } = useGeoData();

  const initialState = {
    titleValue: "",
    listingTypeValue: "",
    descriptionValue: "",
    areaValue: "",
    boroughValue: "",
    selectedBorough: null,
    boroughList: [],
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    picture4Value: "",
    picture5Value: "",
    mapInstance: null,
    markerPosition: {
      lat: "51.505",
      lng: "-0.09",
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
    disableBtn: false,
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    areaErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    boroughErrors: {
      hasErrors: false,
      errorMessage: "",
    },
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
      case "catchAreaChange":
        draft.areaValue = action.areaChosen;
        draft.boroughList = boroughOptions.filter(
          (borough) => borough.area === action.areaChosen
        );
        draft.boroughList.unshift({ name: "" });
        console.log("draft.boroughList", draft.boroughList);
        break;
      case "catchBoroughChange":
        draft.boroughValue = action.boroughChosen;
        draft.selectedBorough = boroughOptions.find(
          (b) => b.name === action.boroughChosen
        );
        break;
      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;
      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
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
      case "catchPicture1Change":
        draft.picture1Value = action.picture1Chosen;
        break;
      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;
      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;
      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;
      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
        break;
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = "";
        draft.longitudeValue = "";
        break;
      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
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
  const TheMapComponent = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        dispatch({
          type: "getMap",
          mapData: map,
        });
      }
    }, [map, dispatch]); // сработает только когда появится новый map
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      await reloadGeoData();
    }
    fetchData();
  }, []);
  console.log("GeoData fetched in AddProperty:", geoData);


  // Build area list
  areaOptions = [{ value: "", label: "" }];
  geoData?.map((area) => {
    areaOptions.push({ value: area.name, label: area.name });
  });

  console.log("geoData:", geoData);

  // Build borough list
  boroughOptions = [];
  geoData?.forEach((area) => {
    area.boroughs?.forEach((borough) => {
      boroughOptions.push({
        name: borough.name,
        area: area.name,
        longitude: borough.longitude,
        latitude: borough.latitude,
        border: borough.border,
      });
    });
  });

  // Use effect to change the map view depending on chosen borough

  useEffect(() => {
    if (!state.boroughValue) return;
    console.log("state.boroughValue changed to:", state.boroughValue);
    console.log("boroughOptions:", boroughOptions);
    const borough = boroughOptions.find(
      (b) => b.name === state.boroughValue
    );
    const longitude = borough?.longitude;
    const latitude = borough?.latitude;
    state.mapInstance?.setView([latitude, longitude], 12);
    dispatch({
      type: "changeMarkerPosition",
      changeLatitude: latitude,
      changeLongitude: longitude,
    });
  }, [state.boroughValue]);





  // Use effect to catch uploaded pictures and put them in the state
  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

  // Request to get profile info
  useEffect(() => {
    const GetProfileInfo = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
        console.log("Response data received");
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
        console.log(e.response);
      }
    };
    GetProfileInfo();
  }, []);

  const FormSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
    ToastSuccess()
      .fire("Your property is being added...")
      .then(() => {
        navigate("/listings");
      });
  };

  // Use effect to send the form data to the backend
  useEffect(() => {
    if (state.sendRequest) {
      const ourRequest = Axios.CancelToken.source();
      async function AddProperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("area", state.areaValue);
        formData.append("borough", state.boroughValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("price", state.priceValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("rooms", state.roomsValue);
        formData.append("furnished", state.furnishedValue);
        formData.append("pool", state.poolValue);
        formData.append("elevator", state.elevatorValue);
        formData.append("cctv", state.cctvValue);
        formData.append("parking", state.parkingValue);
        formData.append("latitude", state.latitudeValue);
        formData.append("longitude", state.longitudeValue);
        formData.append("picture1", state.picture1Value);
        formData.append("picture2", state.picture2Value);
        formData.append("picture3", state.picture3Value);
        formData.append("picture4", state.picture4Value);
        formData.append("picture_5", state.picture5Value);
        formData.append("seller", GlobalState.userId);
        try {
          const response = await Axios.post(URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            // withCredentials: true,
            cancelToken: ourRequest.token,
          });
          console.log("Response data received");
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          dispatch({ type: "allowTheButton" });
          console.log("There was a problem or the request was cancelled.");
          console.log(e.response);
        }
      }
      AddProperty();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendRequest]);

  const PriceDisplay = () => {
    if (state.propertyStatusValue === "Rent" && state.rentalFrequencyValue) {
      return "Price (per " + state.rentalFrequencyValue + ")";
    } else {
      return "Price";
    }
  };

  const SubmitButtonDisplay = () => {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.agencyName &&
      state.userProfile.phoneNumber
    ) {
      return (
        <Button
          className={styles.registerBtn}
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={state.disableBtn}
        >
          SUBMIT
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (!state.userProfile.agencyName || !state.userProfile.phoneNumber)
    ) {
      return (
        <Button
          className={styles.registerBtn}
          variant="outlined"
          onClick={() => navigate("/profile")}
          fullWidth
        >
          COMPLETE YOUR PROFILE TO ADD A PROPERTY
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          className={styles.registerBtn}
          variant="outlined"
          onClick={() => navigate("/login")}
          fullWidth
        >
          SIGN IN TO ADD A PROPERTY
        </Button>
      );
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


  if (geoDataAreLoading)
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress size="lg" />;
      </Grid>
    );

  if (geoDataError)
    return <Alert severity="error">Error: {geoDataError}</Alert>;


  return (
    <div className={styles.formContainer}>
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">SUBMIT A PROPERTY</Typography>
        </Grid>
        <Grid item container className={styles.formItem}>
          <TextField
            id="title"
            label="Title"
            variant="standard"
            fullWidth
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: e.target.value,
              })
            }
            required
          />
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          {/* Listing Type */}
          <Grid item className={styles.formItemSideBySide}>
            <TextField
              id="listingType"
              label="Listing Type"
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
              required
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
              label="Property Status"
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
              required
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
              required={state.propertyStatusValue === "Rent"}
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
              required
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

        <Grid item container justifyContent={"space-between"}>
          <Grid className={styles.formItemSideBySide}>
            <TextField
              id="area"
              label="Area"
              variant="standard"
              fullWidth
              value={state.areaValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAreaChange",
                  areaChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid className={styles.formItemSideBySide}>
            <TextField
              id="borough"
              label="Borough"
              variant="standard"
              fullWidth
              value={state.boroughValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBoroughChange",
                  boroughChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {state.boroughList.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item className={styles.formItem}>
          {state.latitudeValue && state.longitudeValue ? (
            <Alert severity="success">
              Your property is located @ {state.latitudeValue},{" "}
              {state.longitudeValue}
            </Alert>
          ) : (
            <Alert severity="warning">
              Please drag the marker on the map to set the exact location of
              your property.
            </Alert>
          )}
        </Grid>

        {/* Map */}
        <Grid item container>
          <MapContainer
            className={styles.map}
            center={[51.505, -0.09]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TheMapComponent />

            {state.selectedBorough &&
              <Polygon positions={state.selectedBorough.border} />}

            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
        </Grid>

        <Grid item container className={styles.registerDiv} xs={6}>
          <Button
            className={styles.picturesBtn}
            variant="contained"
            component="label"
            color="primary"
            fullWidth
          >
            UPLOAD PICTURES (MAX 5)
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/gif"
              hidden
              onChange={(e) =>
                dispatch({
                  type: "catchUploadedPictures",
                  picturesChosen: e.target.files,
                  consoleLog: console.log("Files:", e.target.files),
                })
              }
            />
          </Button>
        </Grid>

        <Grid item container>
          {state.picture1Value && <li>{state.picture1Value.name}</li>}
        </Grid>
        <Grid item container>
          {state.picture2Value && <li>{state.picture2Value.name}</li>}
        </Grid>
        <Grid item container>
          {state.picture3Value && <li>{state.picture3Value.name}</li>}
        </Grid>
        <Grid item container>
          {state.picture4Value && <li>{state.picture4Value.name}</li>}
        </Grid>
        <Grid item container>
          {state.picture5Value && <li>{state.picture5Value.name}</li>}
        </Grid>

        <Grid item container className={styles.registerDiv} xs={8}>
          {SubmitButtonDisplay()}
        </Grid>
      </form>

      {/* <Snackbar
        open={state.openSnack}
        message="You have successfully added your property."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{ class: styles.snackbar }}
      /> */}
    </div>
  );
}

export default AddProperty;
