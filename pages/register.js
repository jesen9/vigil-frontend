import React, { useEffect, useState, useRef } from "react";
import Head from 'next/head';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Grid,
  Divider,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from "next/router";
import Image from "next/image";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from "../services/api";
import { setToken, getToken } from "../utils/token";
import useToast from "../utils/toast";
import vigil from "../public/static/logo/vigil.png"
import CircularProgress from '@mui/material/CircularProgress';
import Link from "../utils/link";

const Register = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [registerValue, setregisterValue] = useState({
    username:"",
    email: "",
    password: "",
    confirmPassword:"",
  });

  var [loading, setLoading] = useState(false)
  
  const handleChange = (event) => {
    setregisterValue({ ...registerValue, [event.target.name]: event.target.value });
  };

  const handleKeyDownUsername = (event) => {
    if (event.key === "Enter") {
      emailRef.current.focus();
    }
   };

  const handleKeyDownEmail = (event) => {
    if (event.key === "Enter") {
      passwordRef.current.focus();
    }
   };

  const handleKeyDownPassword = (event) => {
    if (event.key === "Enter") {
      confirmPasswordRef.current.focus();
    }
  };

  const handleKeyDownConfirmPassword = (event) => {
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
      localStorage.clear();

      const registerData= {
        email: registerValue.email,
        password: registerValue.password,
        username: registerValue.username,
      }

      setLoading((true));

      if (registerValue.password !== registerValue.confirmPassword) {
        // Password and confirm password do not match
        displayToast("error", "Password and confirm password do not match");
        setLoading((false));
        return;// Stop further execution
      }

      if (!validateEmail(registerValue.email)) {
        displayToast("error", "Invalid Email");
        setLoading((false));
        return;
      }

      // console.log('gaby', registerValue) 
      const response = await api.register(registerData); 
      const {data} = response;
     
      // console.log(response, 'response Register');
      if (data.message === "New user created!") {
        displayToast("success", data.message);
        // setLoading((loading = false));

        router.push("/login")

      } else {
        console.log("Registration failed");
        displayToast("error", data.message);
        setLoading((loading = false));
      }
    } catch (error) {
      displayToast("error", "Registration failed");
      setLoading((loading = false));
    }
  }

  

  return (
    <div>

  
    <Box
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
        style={{ minHeight: "100vh" }}
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
              <Stack component="form" spacing={1.5} noValidate>
                <Box display={"flex"} justifyContent={"center"}>
                  <Image
                    src={vigil}
                    width={100}
                    height={100}
                    alt="login logo"
                  />
                </Box>
                  

                <Box display="flex" justifyContent="center">
                  <Typography sx={{mr:1}}>Already have an account?</Typography>
                  <Link href="/login" sx={{ textDecoration: "none" }}>
                    <Typography variant="subtitle2">Log In</Typography>
                  </Link>
                </Box>

                 
                <Divider sx={{ marginTop: "16px" }} />
                <TextField
                  label="Username"
                  name="username"
                  value={registerValue.username}
                  onChange={handleChange}
                  onKeyDown={handleKeyDownUsername}
                  inputRef={(el) => (usernameRef.current = el)}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={registerValue.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDownEmail}
                  inputRef={(el) => (emailRef.current = el)}
                />

                <FormControl  variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name = "password"
                        value={registerValue.password}
                        onChange={handleChange}
                    onKeyDown={handleKeyDownPassword}
                    inputRef={(el) => (passwordRef.current = el)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onKeyDown={handleKeyDownPassword}
                           
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      
                    />
                  </FormControl>

                  <FormControl  variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name= "confirmPassword"
                      value={registerValue.confirmPassword}
                      onChange={handleChange}
                      onKeyDown={handleKeyDownConfirmPassword}
                      inputRef={(el) => (confirmPasswordRef.current = el)}
                      type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            onKeyDown={handleKeyDownConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      
                    />
                  </FormControl>

                <Divider sx={{ mt: 2 }} />
                <Button
                  disabled={!registerValue.email || !registerValue.password || !registerValue.username  || loading}
                  onClick={onFinish}
                  sx={{ mt: 3 }}
                  variant="contained"
                  startIcon={loading && <CircularProgress size='1rem' color="inherit"/>}
                >
                  Sign Up
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
};

export default Register;
