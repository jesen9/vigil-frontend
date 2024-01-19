import React, { useEffect, useState } from "react";
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

  const [loginValue, setLoginValue] = useState({
    email: "admin@gmail.com",
    password: "admin1234",
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

  const validateEmail = (email) => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onFinish() {
    try {
      // setToken("token", "jwtToken");

      // if (!validateEmail(loginValue.email)) {
      //   displayToast("error", "invalid Email");
      //   setLoading((loading = false));
      //   return;
      // }
      // const postLoginData = await api.loginApi(loginValue);
      // setToken("token", postLoginData.data.data.token);
      router.replace("/");
    } catch (error) {
      displayToast("error", "Failed to login");
    }
  }

  // if (typeof window !== "undefined" && getToken("token")) {
  //   return null;
  // }
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
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginValue.password}
                  onChange={handleChange}
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
