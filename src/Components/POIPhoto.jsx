import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";

import defaultPOI from "./Assets/defaultPOI.jpeg";

export default function POIPhoto({POI_Name}) {
  const [imageUrl, setImageUrl] = useState(null);


  const searchPhoto = async () => {
    if (!POI_Name) return;

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&origin=*&titles=${encodeURIComponent(
          POI_Name
        )}`
      );
      const data = await response.json();

      const pages = data.query.pages;
      const page = Object.values(pages)[0];

      if (page?.original?.source) {
        setImageUrl(page.original.source);
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error(error);
      setImageUrl(null);
    }
  };

  useEffect(() => {
    searchPhoto();
  }, []); // Run only once on component mount

  return (
    <Box sx={{ p: 3, mx: "auto" }}>
      <Card>
        <CardMedia
          component="img"
          image={
            imageUrl ||
            defaultPOI
          }
          alt={POI_Name}
          sx={{ objectFit: "contain" }}
          style={{ height: "14rem", width: "18rem", cursor: "pointer" }}
        />
      </Card>
    </Box>
  );
}
