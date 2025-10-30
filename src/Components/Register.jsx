import React, { useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";

// Custom imports
import styles from "./CSS_Modules/Register.module.css";
// import { Toast } from "../plugins/Toast"; --- IGNORE ---
import { ToastSuccess } from "../plugins/Toast";

const data = {
  username: "testinguser",
  email: "t@lbrep.com",
  password: "mypass123",
  re_password: "mypass123",
};

function Register() {
  const navigate = useNavigate();
  const URL = "http://localhost:8000/api-auth-djoser/users/";

  const initialState = {
    usernameValue: "",
    emailValue: "",
    passwordValue: "",
    password2Value: "",
    sendRequest: 0,
    openSnack: false,
    disableBtn: false,
    userNameErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    emailErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    passwordErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    password2HelperText: "",
    serverError: false,
    errorMessage: "",
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.userNameErrors.hasErrors = false;
        draft.userNameErrors.errorMessage = "";
        draft.serverError = false;
        break;
      case "catchEmailChange":
        draft.emailValue = action.emailChosen;
        draft.emailErrors.hasErrors = false;
        draft.emailErrors.errorMessage = "";
        draft.serverError = false;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.passwordErrors.hasErrors = false;
        draft.passwordErrors.errorMessage = "";
        draft.serverError = false;
        break;
      case "catchPassword2Change":
        draft.password2Value = action.password2Chosen;
        draft.password2HelperText =
          action.password2Chosen !== draft.passwordValue
            ? "Passwords do not match."
            : "";
        draft.serverError = false;
        break;
      case "changeSendRequest":
        draft.sendRequest += 1;
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
      case "catchUsernameErrors":
        if (action.usernameChosen == "") {
          draft.userNameErrors.hasErrors = true;
          draft.userNameErrors.errorMessage = "Username cannot be empty.";
        } else if (action.usernameChosen.length < 5) {
          draft.userNameErrors.hasErrors = true;
          draft.userNameErrors.errorMessage =
            "Username must be at least 5 characters long.";
        } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
          draft.userNameErrors.hasErrors = true;
          draft.userNameErrors.errorMessage =
            "Username can only contain letters and numbers.";
        } else {
          draft.userNameErrors.hasErrors = false;
          draft.userNameErrors.errorMessage = "";
        }
        break;
      case "catchEmailErrors":
        if (action.emailChosen == "") {
          draft.emailErrors.hasErrors = true;
          draft.emailErrors.errorMessage = "Email cannot be empty.";
        } else if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            action.emailChosen
          )
        ) {
          draft.emailErrors.hasErrors = true;
          draft.emailErrors.errorMessage = "Invalid email address.";
        } else {
          draft.emailErrors.hasErrors = false;
          draft.emailErrors.errorMessage = "";
        }
        break;
      case "catchPasswordErrors":
        if (action.passwordChosen == "") {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage = "Password cannot be empty.";
        } else if (action.passwordChosen.length < 8) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            "Password must be at least 8 characters long.";
        } else if (!/[a-z]/.test(action.passwordChosen)) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            "Password must contain at least one lowercase letter.";
        } else if (!/[A-Z]/.test(action.passwordChosen)) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(action.passwordChosen)) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            "Password must contain at least one number.";
        } else {
          draft.passwordErrors.hasErrors = false;
          draft.passwordErrors.errorMessage = "";
        }
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
    data.username = state.usernameValue;
    data.email = state.emailValue;
    data.password = state.passwordValue;
    data.re_password = state.password2Value;
    // setSendRequest((prev) => !prev);
    if (
      state.userNameErrors.hasErrors ||
      state.emailErrors.hasErrors ||
      state.passwordErrors.hasErrors ||
      state.password2Value !== state.passwordValue ||
      state.usernameValue == "" ||
      state.emailValue == "" ||
      state.passwordValue == "" ||
      state.password2Value == ""
    ) {
      return;
    }
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
    dispatch({ type: "openTheSnack" });
  };
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      const SignUp = async () => {
        try {
          const response = await Axios.post(URL, data, {
            cancelToken: source.token,
          });
          ToastSuccess()
            .fire(
              "You have successfully created an account!" +
                "\n" +
                response.data.id
            )
            .then(() => {
              navigate("/");
            });
        } catch (error) {
          console.error("Error registering user:", error.response.data);
          dispatch({ type: "allowTheButton" });
          let errorMessage = "";
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorData = error.response.data;
            for (const key in errorData) {
              if (Array.isArray(errorData[key])) {
                errorMessage += `${key}: ${errorData[key].join(" ")}\n`;
              } else {
                errorMessage += `${key}: ${errorData[key]}\n`;
              }
            }
          }
          console.log("Compiled Error Message:", errorMessage);
          dispatch({ type: "errorMessage", errorInfo: errorMessage });
          dispatch({ type: "catchServerError" });
          // Optionally, you can set a generic error message if needed
          // dispatch({ type: "errorMessage", errorInfo: "An error occurred during registration. Please try again." });
          // Example of rendering the error message in an Alert component
          //
        }
      };
      SignUp();
      return () => {
        source.cancel("Component unmounted, request cancelled");
      };
    }
  }, [state.sendRequest]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">CREATE AN ACCOUNT</Typography>
        </Grid>
        {state.serverError && (
          // <Grid
          //   item
          //   container
          //   justifyContent="center"
          //   sx={{ mt: 2, whiteSpace: "pre-line" }}
          // >
          //   <Alert severity="error"> {state.errorMessage} </Alert>
          //   <Grid item container justifyContent="center" sx={{ mt: 2 }}>
          //     <Alert severity="info">Please use another</Alert>
          //   </Grid>
          // </Grid>
          <>
            <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
              {" "}
              {state.errorMessage}{" "}
            </Alert>
            <Alert severity="info" className={styles.myInfoAlert}>Please use another</Alert>
          </>
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
            onBlur={(e) => {
              dispatch({
                type: "catchUsernameErrors",
                usernameChosen: e.target.value,
              });
            }}
            error={state.userNameErrors.hasErrors}
            helperText={state.userNameErrors.errorMessage}
          />
        </Grid>
        <Grid item container className={styles.formItem}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={state.emailValue}
            onChange={(e) =>
              dispatch({
                type: "catchEmailChange",
                emailChosen: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({
                type: "catchEmailErrors",
                emailChosen: e.target.value,
              })
            }
            error={state.emailErrors.hasErrors}
            helperText={state.emailErrors.errorMessage}
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
            onBlur={(e) => {
              dispatch({
                type: "catchPasswordErrors",
                passwordChosen: e.target.value,
              });
            }}
            error={state.passwordErrors.hasErrors}
            helperText={state.passwordErrors.errorMessage}
          />
        </Grid>
        <Grid item container className={styles.formItem}>
          <TextField
            id="password2"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            value={state.password2Value}
            onChange={(e) =>
              dispatch({
                type: "catchPassword2Change",
                password2Chosen: e.target.value,
              })
            }
            helperText={state.password2HelperText}
          />
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
            SIGN UP
          </Button>
        </Grid>
      </form>
      <Grid
        item
        container
        justifyContent="center"
        className={styles.loginPrompt}
      >
        <Typography variant="small">
          Already have an account?{" "}
          <span
            className={styles.signinLink}
            onClick={() => navigate("/login")}
          >
            SIGN IN
          </span>
        </Typography>
      </Grid>
      {/* <Snackbar
        open={state.openSnack}
        message="You have successfully created an account!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // className={styles.snackbar}
        // autoHideDuration={3000}
        // ContentProps={{ style: { backgroundColor: "blue", color: "white" } }}
        ContentProps={{ class: styles.snackbar }}
      /> */}
    </div>
  );
}

export default Register;
