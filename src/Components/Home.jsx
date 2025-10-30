// import * as React from "react";4
import { useState } from "react";

// MUI imports
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Assets
import city from "./Assets/city.jpg";

// Custom styles
import styles from "./CSS_Modules/Home.module.css";

export default function Home() {
return (
  <>
    {/* <img src={city} style={{width: "100%", height: "90vh"}} /> */}
    <div style={{ position: "relative" }}>
      <img src={city} alt="City" className={styles.backImg} />
      <div
        style={{
          position: "absolute",
          zIndex: "100",
          top: "100px",
          left: "20px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          style={{ color: "white", fontWeight: "bolder" }}
        >
          FIND YOUR <span style={{ color: "green" }}>NEXT PROPERTY</span> ON
          THE LBREP WEBSITE
        </Typography>
        <Button
          variant="contained"
          style={{
            fontSize: "3.5rem",
            borderRadius: "15px",
            backgroundColor: "green",
            marginTop: "2rem",
            boxShadow: "3px 3px 3px white",
          }}
        >
          SEE ALL PROPERTIES
        </Button>
      </div>
    </div>
  </>
);
}
