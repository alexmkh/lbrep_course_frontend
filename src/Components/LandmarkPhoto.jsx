import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";

export default function LandmarkPhoto() {
  const [query, setQuery] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const searchPhoto = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&origin=*&titles=${encodeURIComponent(
          query
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

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Найти фото достопримечательности
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Введите название (например, Eiffel Tower)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={searchPhoto}>
          Найти
        </Button>
      </Box>

      {imageUrl ? (
        <Card>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={query}
            sx={{ maxHeight: 400, objectFit: "contain" }}
          />
        </Card>
      ) : (
        query && (
          <Typography variant="body2" color="text.secondary">
            Фото не найдено
          </Typography>
        )
      )}
    </Box>
  );
}
