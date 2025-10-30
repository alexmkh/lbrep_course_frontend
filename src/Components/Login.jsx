import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

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
  Snackbar,
  Alert,
} from "@mui/material";

// Custom imports
import styles from "./CSS_Modules/Login.module.css";

import { ToastSuccess } from "../plugins/Toast";

// Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

const initialState = {
  usernameValue: "",
  passwordValue: "",
  sendRequest: 0,
  token: "",
  openSnack: false,
  disableBtn: false,
  serverError: false,
  errorMessage: "",
};

function Login() {
  const navigate = useNavigate();
  const URL = "http://localhost:8000/api-auth-djoser/";

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case "changeSendRequest":
        draft.sendRequest += 1;
        break;
      case "catchToken":
        draft.token = action.tokenValue;
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
      case "catchServerError":
        draft.serverError = true;
        break;
      case "serverErrorFalse":
        draft.serverError = false;
        break;
      case "errorMessage":
        draft.errorMessage = action.errorInfo;
        break;

      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  const FormSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
    dispatch({ type: "openTheSnack" });
  };

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      const SignIn = async () => {
        try {
          const response = await Axios.post(
            URL + "token/login/",
            { username: state.usernameValue, password: state.passwordValue },
            {
              cancelToken: source.token,
            }
          );
          console.log("Token:", response.data.auth_token);
          dispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
          GlobalDispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
          ToastSuccess()
            .fire("You have successfully logged in.")
            .then(() => {
              navigate("/");
            });

          // navigate("/");
        } catch (error) {
          dispatch({ type: "catchServerError" });
          console.log("Error login:", error.response.data.non_field_errors[0]);
          dispatch({ type: "errorMessage", errorInfo: error.response.data.non_field_errors[0] });
          dispatch({ type: "allowTheButton" });
        }
      };
      SignIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  useEffect(() => {
    // let response
    if (state.token !== "") {
      const source = Axios.CancelToken.source();
      const GetUserInfo = async () => {
        try {
          const response = await Axios.get(
            URL + "users/me/",
            { headers: { Authorization: "Token ".concat(state.token) } },
            {
              cancelToken: source.token,
            }
          );
          GlobalDispatch({
            type: "userSignsIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            userIdInfo: response.data.id,
          });
          dispatch({ type: "openTheSnack" });
          // navigate("/");
        } catch (error) {

          console.log("Error login:", error.response.data.non_field_errors[0]);
        }
      };
      GetUserInfo();
      return () => {
        source.cancel("Component unmounted, request cancelled");
      };
    }
  }, [state.token]);

  // useEffect(() => {
  //   if (state.openSnack) {
  //     ToastSuccess().fire("You have successfully logged in.");
  //     const timer = setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [state.openSnack]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">SIGN IN</Typography>
        </Grid>

        {state.serverError && (
          <Grid item container justifyContent="center" sx={{ mt: 2 }}>
            <Alert severity="error"> {state.errorMessage} </Alert>
          </Grid>
        )}

        <Grid item container className={styles.formItem}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={state.usernameValue}
            onChange={(e) =>
              dispatch({
                type: "catchUsernameChange",
                usernameChosen: e.target.value,
              })
            }
            error={state.serverError}
            onFocus={() => dispatch({ type: "serverErrorFalse" })}
          />
        </Grid>

        <Grid item container className={styles.formItem}>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={state.passwordValue}
            onChange={(e) =>
              dispatch({
                type: "catchPasswordChange",
                passwordChosen: e.target.value,
              })
            }
            error={state.serverError}
            onFocus={() => dispatch({ type: "serverErrorFalse" })}
          />
        </Grid>
        <Grid item container className={styles.loginDiv} xs={8}>
          <Button
            className={styles.loginBtn}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={state.disableBtn}
          >
            SIGN IN
          </Button>
        </Grid>
      </form>
      <Grid
        item
        container
        justifyContent="center"
        className={styles.registerPrompt}
      >
        <Typography variant="small">
          Don't have an account yet?{" "}
          <span
            className={styles.signupLink}
            onClick={() => navigate("/register")}
          >
            SIGN UP
          </span>
        </Typography>
      </Grid>
      {/* <Snackbar
        open={state.openSnack}
        message="You have successfully logged in."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{class: styles.snackbar}}
      /> */}
    </div>
  );
}

export default Login;
