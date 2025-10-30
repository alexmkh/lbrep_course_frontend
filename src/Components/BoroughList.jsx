import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

import L from "leaflet";

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
  Alert,
} from "@mui/material";

// Map icons
import houseIconPng from "./Assets/Mapicons/house.png";
import apartmentIconPng from "./Assets/Mapicons/apartment.png";
import officeIconPng from "./Assets/Mapicons/office.png";

import styles from "./CSS_Modules/Listings.module.css";
import POIPhoto from "./POIPhoto";

import { useGeoData } from "./GeoDataContext";

export default function BoroughList() {
  const { geoData, geoDataAreLoading, geoDataError, reloadGeoData } =
    useGeoData();
  const [map, setMap] = useState(null);
  const TheMapComponent = () => {
    setMap(useMap());
    return null;
  };

  const handleBoroughClick = (borough) => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.remove();
        }
      });
      L.marker([borough.latitude, borough.longitude]).addTo(map).bindPopup(borough.name).openPopup();
      map.flyTo([borough.latitude, borough.longitude], 12);
      L.polygon(borough.border).addTo(map);
    }
  };

  const navigate = useNavigate();

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

  console.log("Rendering BoroughList with geodata:", geoData);

  return (
    <div>
      <button onClick={reloadGeoData}>🔄 Обновить</button>
      <h1>Borough List</h1>
      {console.log("GeoData in render:", geoData)}
      <Grid container>
        <Grid item xs={4}>
          {geoData.map((area) => (
            <div key={area.id}>
              <Typography variant="h6">{area.name}</Typography>
              {area.boroughs?.map((b) => (
                <Card
                  className={styles.cardStyle}
                  key={b.id}
                  onClick={() => {
                    handleBoroughClick(b);
                  }}
                >
                  <CardHeader
                    title={b.name}
                    subheader={`Area: ${b.area}`}
                    // action={ console.log("Borough clicked:", b.name)}
                  />
                  <CardContent>
                    {/* <Typography variant="body2" color="textSecondary">
                      Border Points: {b.border ? b.border.length : "N/A"}
                    </Typography> */}
                    <POIPhoto POI_Name={b.name} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" align="center">
            The map
          </Typography>
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
            </MapContainer>
          </AppBar>
        </Grid>
      </Grid>
    </div>
  );
}
