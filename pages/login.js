import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "../utils/link";
import { useRouter } from "next/router";
import Image from "next/image";
import vigil from "../public/static/logo/vigil.png"
import api from "../services/api";
import { setToken, getToken } from "../utils/token";
import useToast from "../utils/toast";
import { setStorage, getStorage, deleteStorage } from "../utils/storage";
// import CenturyLogo from "../public/static/logo/century.png";

const Login = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const passwordRef = useRef(null);
  const userID = getStorage("user_id");
  const username = getStorage("username");
  const token = getToken("token");

  console.log("user", userID, username, token);

  const [loginValue, setLoginValue] = useState({
    email: "",
    password: "",

  });
  const handleChange = (event) => {
    setLoginValue({ ...loginValue, [event.target.name]: event.target.value });
  };

  // useEffect(() => {
  //   console.log(getToken("token"));
  //   if (getToken("token")) {
  //     router.push("/");
  //   }
  // }, []);

  const handleKeyDownEmail = (event) => {
    if (event.key === "Enter") {
      passwordRef.current.focus();
    }
   };

   const handleKeyDownPassword = (event) => {
    if (event.key === "Enter") {
     onFinish();
    }
  };

  const validateEmail = (email) => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onFinish() {
    try {
      // setToken("token", "jwtToken");

      if (!validateEmail(loginValue.email)) {
        displayToast("error", "invalid Email");
        setLoading((loading = false));
        return;
      }
      const postLoginData = await api.loginApi(loginValue);
      const {data} = postLoginData;
      setStorage("user_id", data.user_id);
      setStorage("username", data.username);
      setToken("token", data.plain_text)

      console.log('login',postLoginData)
      if(data.message === 'Login Success') {
        displayToast("success", data.message);
        router.replace("/");
        // setLoading((loading = false));
      }
      else{
        displayToast("error", data.message);
        setLoading((loading = false));
      }
      // setToken("token", postLoginData.data.data.token);
      
    } catch (error) {
      displayToast("error", "Login Failed");
    }
  }

  return (
    <React.Fragment
      sx={{
        backgroundColor: "#8EB4F4",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", backgroundColor: "#8EB4F4",}}
      >
        <Grid
          item
          xs={3}
          sx={{
            zIndex: "5",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "380px",
              background: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: " 12px",
              padding: "10px 0px",
            }}
          >
            <CardContent>
              <Stack component="form" spacing={2} noValidate>
                <Box display={"flex"} justifyContent={"center"}>
                  <Image
                    src={vigil}
                    width={100}
                    height={100}
                    alt="login logo"
                  />
                </Box>
                <Divider sx={{ marginTop: "16px" }} />
                <TextField
                  label="Email"
                  name="email"
                  value={loginValue.email}
                  onKeyDown={handleKeyDownEmail}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginValue.password}
                  onKeyDown={handleKeyDownPassword}
                  onChange={handleChange}
                  inputRef={passwordRef}
                />
                <Divider sx={{ mt: 2 }} />
                <Button
                  disabled={!loginValue.email || !loginValue.password}
                  onClick={onFinish}
                  sx={{ mt: 3 }}
                  variant="contained"
                >
                  Log In
                </Button>
                <Box display="flex" justifyContent="center">
                  <Typography>Don&apos;t have an account?</Typography>
                  <Link  href="/register" sx={{ textDecoration: "none",  }}>
                    <Typography variant="subtitle2" sx={{ml:1}}>Sign Up</Typography>
                  </Link>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Login;
