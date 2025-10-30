import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// MUI imports
import { StyledEngineProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";

import Header from "./Components/Header";

// Components
import Listings from "./Components/Listings";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Testing from "./Components/Testing";
import Register from "./Components/Register";
import AddProperty from "./Components/AddProperty";
import Profile from "./Components/Profile";
import Agencies from "./Components/Agencies";
import AgencyDetail from "./Components/AgencyDetail";
import ListingDetail from "./Components/ListingDetail";
import LandmarkPhoto from "./Components/LandmarkPhoto";
import Borough from "./Components/Borough";
import BoroughList from "./Components/BoroughList";
import HaveringMap from "./Components/HaveringMap";

// Contexts for the app
import { useImmerReducer } from "use-immer";
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";
import { GeoDataProvider } from "./Components/GeoDataContext";

function App() {
  const initialState = {
    userUsername: localStorage.getItem("theUserUsername") || "",
    userEmail: localStorage.getItem("theUserEmail") || "",
    userId: localStorage.getItem("theUserId") || "",
    userToken: localStorage.getItem("theUserToken") || "",
    userIsLogged: localStorage.getItem("theUserUsername") ? true : false,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "userSignsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.userIdInfo;
        draft.userIsLogged = true;
        break;
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
      case "logout":
        draft.userIsLogged = false;
        break;
      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem("theUserUsername", state.userUsername);
      localStorage.setItem("theUserEmail", state.userEmail);
      localStorage.setItem("theUserId", state.userId);
      localStorage.setItem("theUserToken", state.userToken);
    } else {
      localStorage.removeItem("theUserUsername");
      localStorage.removeItem("theUserEmail");
      localStorage.removeItem("theUserId");
      localStorage.removeItem("theUserToken");
    }
  }, [state.userIsLogged, state.userUsername]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <GeoDataProvider>
          <StyledEngineProvider injectFirst>
            <BrowserRouter>
              <CssBaseline />
              <Header />
              {/* Main App Bar */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/agencies/:id" element={<AgencyDetail />} />
                <Route path="/addproperty" element={<AddProperty />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/poiphoto" element={<LandmarkPhoto />} />
                <Route path="/testing" element={<Testing />} />
                <Route path="/borough" element={<Borough />} />
                <Route path="/borough-list" element={<BoroughList />} />
                <Route path="/havering" element={<HaveringMap />} />
                {/* Add more routes as needed */}
              </Routes>
            </BrowserRouter>
          </StyledEngineProvider>
        </GeoDataProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
