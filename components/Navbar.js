import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton, TextField, InputAdornment, Button, Divider, Typography } from "@mui/material";
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router';
import { setUser } from "../redux/actions/userAction";
import { getToken } from "../utils/token";
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setStorage, getStorage, deleteStorage } from "../utils/storage";

import NotificationIcon from "./NotificationIcon";
import NotificationList from "./NotificationList";

const Navbar = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const {
    user: { email },
  } = userReducer;
  const router = useRouter();
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
  const userID = getStorage("user_id");
  const username = getStorage("username");

  // console.log("user", userID, username)
 

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

  function searchValue() {
    const searchBox = document.getElementById('keywordSearch');
    searchBox.addEventListener('change', function handleChange(event) {
      console.log('masok debug value search', event.target.value); // 👉️ get selected VALUE
    
      // 👇️ get selected VALUE even outside event handler
      console.log(select.options[select.selectedIndex].value);
    
      // 👇️ get selected TEXT in or outside event handler
      console.log(select.options[select.selectedIndex].text);
    });
  }
  
  const [keyword, setKeyword] = React.useState([]);

  // React.useEffect(() => {
  //   const getCvelist = async () => {
  //     const response = await fetch(`http://localhost:8000/api/getcvelist?keywordSearch=${keyword}&resultsPerPage=10&startIndex=0`);
  //     const cvelist = await response.json();
  //     setCvelist(cvelist);
  //   }
  //   getCvelist();
  // }, []);
  // console.log(cvelist, cvelist.length);

  // const handleSubmit = async (e) => {
  //   console.log('masok ga sih');
  //   e.preventDefault();
  //   // const response = await fetch(`http://localhost:8000/api/getcvelist?keywordSearch=${keyword}&resultsPerPage=10&startIndex=0`);
  //   // const cvelist = await response.json();
  //   console.log(cvelist, cvelist.length);
  //   router.push(`/cvelist?keywordSearch=${keyword}&resultsPerPage=10&startIndex=0`);
  //   // gimana caranya kirim cvelist ke ../cvelist/index.js?
  // }

  const handleKeyDownSearch = (event, keyword) => {
    if (event.key === "Enter") {
      if (router.pathname === "/cvelist") {
        console.log("aaaa")
        router.replace(`/cvelist?keywordSearch=${keyword}`);
        setTimeout(() => {
          router.reload(); // Reload the page
        }, 200);  
      }
      else{
        console.log('ni keyword', keyword);
        router.push(`/cvelist?keywordSearch=${keyword}`);
      }
      // handleSubmit(event);
    }
  }

  const verify = (e) => {
    console.log('function works');
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      sx={{ width: "100%", background: "white", px: 2, py: 2, }}
    >

      <TextField
        id="keywordSearch"
        name="keywordSearch"
        placeholder="Search keyword (CVE id,vendor, product, etc.)"
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        fullWidth
        onKeyDown={(e) => handleKeyDownSearch(e, e.target.value)}
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
      {userID ? (
        // User is logged in, show username and user icon
        <>
          <Divider orientation="vertical" sx={{ mx: 1, height: 60 }} />
          <Box display="flex" alignItems="center">
            <Typography sx={{mx:1}}>{username}</Typography>
            <AccountCircleIcon />
          </Box>
        </>
      ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={() => router.push(`/login`)}  // Wrap router.push in a function
        >
          Login
        </Button>
      )}
 

    </Box>
  );
};

export default Navbar;
