import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton, TextField, InputAdornment } from "@mui/material";
import jwt_decode from "jwt-decode";

import { setUser } from "../redux/actions/userAction";
import { getToken } from "../utils/token";
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import NotificationIcon from "./NotificationIcon";
import NotificationList from "./NotificationList";

const Navbar = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const {
    user: { email },
  } = userReducer;

  const [listNotification, setListNotification] = useState([
    {
      type: "info",
      message: "this is an info notification",
    },
    {
      type: "warning",
      message: "this is a warning notification",
    },
    {
      type: "error",
      message: "this is an error notification",
    },
  ]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);
  const [anchor, setAnchor] = useState(null);
  const [notifMenuIsOpen, setNotifMenuIsOpen] = useState(false);

  function setUserData() {
    const token = getToken("token");
    const decoded = jwt_decode(token);
    const payloadUser = {
      email: decoded.email,
      username: decoded.username,
    };
    dispatch(setUser(payloadUser));
  }

  function handleNotificationMenuOpen(event) {
    setAnchor(event.currentTarget);
    setNotifMenuIsOpen(true);
  }

  function handleCloseNotificationMenu() {
    setNotifMenuIsOpen(false);
  }

  

  return (
    <Box
      display={"flex"}
      justifyContent={"flex-end"}
      sx={{ width: "100%", background: "white", px: 2, py: 2, }}
    >


     
      <TextField
        id="standard-search"
        placeholder="Search keyword (vendor, product, cvss, etc.)"
        type="search"
        fullWidth
        sx={{mx:'50px'}}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "grey" }} />
            </InputAdornment>
          ),
        }}
      />
 


 

      <IconButton sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
    
      </IconButton>

    </Box>
  );
};

export default Navbar;
