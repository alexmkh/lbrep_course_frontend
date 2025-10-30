import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

// MUI imports
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";

// Custom styles
import styles from "./CSS_Modules/Home.module.css";

import { ToastSuccess } from "../plugins/Toast";

// Contexts
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";

function Header() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandleProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const handleClickBoroughList = () => {
    handleBoroughClose();
    navigate("/borough-list");
  };

  const handleClickBoroughUpload = () => {
    handleBoroughClose();
    navigate("/borough");
  }

  const [boroughAnchorEl, setBoroughAnchorEl] = useState(null);
  const boroughOpen = Boolean(boroughAnchorEl);
  const handleBoroughClick = (event) => {
    setBoroughAnchorEl(event.currentTarget);
  };
  const handleBoroughClose = () => {
    setBoroughAnchorEl(null);
  };


  const [openToast, setOpenToast] = useState(false);

  async function HandleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    const URL = "http://localhost:8000/api-auth-djoser/token/logout/";
    const TOKEN = {
      token: GlobalState.userToken,
    };
    try {
      const response = await Axios.post(URL, TOKEN, {
        headers: { Authorization: "Token ".concat(GlobalState.userToken) },
      });
      console.log("Logout response:", response);
      GlobalDispatch({ type: "logout" });
      ToastSuccess().fire("You have successfully logged out.").then(() => navigate("/"));

    } catch (error) {
      console.log("Error logging out:", error.response);
    }
  }

  return (
    <AppBar position="static" className={styles.appBar}>
      <p>{styles.bgColorBk}</p>
      <Toolbar>
        <div className={styles.btnLeft}>
          {/* <div style={{marginRight: "auto"}}> */}
          <Button color="inherit" onClick={() => navigate("/")}>
            <Typography variant="h4">LBREP</Typography>
          </Button>
        </div>
        <div>
          <Button
            color="inherit"
            className={styles.mr2}
            onClick={() => navigate("/listings")}
          >
            <Typography variant="h6">Listings</Typography>
          </Button>
          <Button
            color="inherit"
            className={styles.ml2}
            onClick={() => navigate("/agencies")}
          >
            <Typography variant="h6">Agencies</Typography>
          </Button>
        </div>

        <Button
          id="borough-button"
          color="inherit"
          aria-controls={open ? "borough-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleBoroughClick}
          className={styles.dashboardBtn}
        >
          <Typography variant="h6">Geography</Typography>
        </Button>
        <Menu
          id="borough-menu"
          anchorEl={boroughAnchorEl}
          open={boroughOpen}
          onClose={handleBoroughClose}
          slotProps={{
            list: {
              "aria-labelledby": "borough-button",
            },
          }}
        >
          <MenuItem onClick={handleClickBoroughList} className={styles.boroughMenuItem}>
            Borough List
          </MenuItem>
          <MenuItem onClick={handleClickBoroughUpload} className={styles.boroughMenuItem}>
            Upload GeoData to DB
          </MenuItem>
        </Menu>

        <div className={styles.btnsRight}>
          <Button
            className={styles.addPropertyBtn}
            onClick={() => navigate("/addproperty")}
          >
            Add Property
          </Button>

          {GlobalState.userIsLogged ? (
            <Button
              className={styles.loginBtn}
              onClick={handleClick}
              // onClick={() => navigate("/login")}
            >
              {GlobalState.userUsername}
            </Button>
          ) : (
            <Button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            <MenuItem className={styles.profileBtn} onClick={HandleProfile}>
              Profile
            </MenuItem>
            <MenuItem className={styles.logoutBtn} onClick={HandleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
