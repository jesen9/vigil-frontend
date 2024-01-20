import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useToast from "../utils/toast";
import MuiDrawer from "@mui/material/Drawer";
import api from "../services/api";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
// import CenturyLogo from "../public/static/logo/century.png"
import VigilLogo from "../public/static/logo/vigil.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from "next/router";
import { getToken, deleteToken } from "../utils/token";
import { Routes } from "./Routes";
import { BottomRoutes } from "./BottomRoutes";
import { setStorage, getStorage, deleteStorage } from "../utils/storage";

const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  // transition: theme.transitions.create("width", {
  //   easing: theme.transitions.easing.sharp,
  //   duration: theme.transitions.duration.enteringScreen,
  // }),
  overflowX: "hidden",
  overflowY: "hidden",
});

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

const Drawer = styled(MuiDrawer, {
  // shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  // background: '#153C6C',
  // flexShrink: 0,
  // whiteSpace: "nowrap",
  overflowX: "hidden",
  overflowY: "hidden",
  // boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DrawerFooter = styled(DrawerHeader)(() => ({
  position: "relative",
  bottom: -120,
  width: "100%",
}));

const ListFooter = styled(List)(() => ({
  position: "relative",
  bottom: -120,
  width: "100%",
}));

const Sidebar = () => {
  const theme = useTheme();
  const [displayToast] = useToast();
  const router = useRouter();
  const [sideBarOpen, setSidebarOpen] = useState(true);
  const userID = getStorage("user_id");

  // useEffect(() => {
  //   if (!getToken("token")) {
  //     changeRoute("/login");
  //   }
  // });

  function changeRoute(route) {
    router.push(`${route}`);
  }

  async function logout() {
   
    const Logout = await api.logout();
    if (Logout.status === 401) {
      localStorage.clear();
      displayToast("info", "Unauthorized, returning to login page");
      router.push("/login"); // Fixed the typo in changeRoute to router.push
    }
    const {data} = Logout;
    console.log(data)
    if (data.status === "User logged out"){
      localStorage.clear();
      displayToast("success", data.status);
      changeRoute("/login");
    }
    else {
      displayToast("info", data.status);
      // localStorage.clear();
      // changeRoute("/register");
    }
  }

  function hasChildren(item) {
    const { submenu: children } = item;
    if (children === undefined) {
      return false;
    }

    if (children.constructor !== Array) {
      return false;
    }

    if (children.length === 0) {
      return false;
    }

    return true;
  }

  const MenuItem = ({ item }) => {
    const Component = hasChildren(item) ? MultiLevel : SingleLevel;
    return <Component item={item} />;
  };

  const SingleLevel = ({ item }) => {
    return (
      <ListItem
        key={item.menu}
        onClick={
          item.path === "/logout"
            ? () => logout()
            : () => changeRoute(item.path)
        }
        disablePadding
        sx={{ display: "block" }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent:  "initial",
            justifyContent: sideBarOpen ? "initial" : "center",
            px: 2.5,
          }}
        >
          <Tooltip
            title={item.menu}
            arrow
            placement="right-start"
            enterDelay={sideBarOpen ? 1000000 : 100}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sideBarOpen ? 3 : "auto",
                justifyContent: "center",
                color: "#ffffff",
                opacity: 0.7,
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            primary={item.menu}
            sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const MultiLevel = ({ item }) => {
    const { submenu: children } = item;
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setIsOpen((prev) => !prev);
    };

    return (
      <>
        <ListItem
          key={item.menu}
          onClick={() => handleClick()}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <Tooltip
              title={item.menu}
              arrow
              placement="right-start"
              enterDelay={sideBarOpen ? 1000000 : 100}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sideBarOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "#ffffff",
                  opacity: 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary={item.menu}
              sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
            />
            {isOpen ? (
              <ExpandLessIcon
                sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen}>
          {children &&
            children.map((child, key) => <MenuItem key={key} item={child} />)}
        </Collapse>
      </>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={sideBarOpen}
      PaperProps={{
        sx: {
          bgcolor: "#8EB4F4",
          
          // transition: (theme) =>
          //   theme.transitions.create("background-color", {
          //     easing: theme.transitions.easing.easeOut,
          //     duration: theme.transitions.duration.enteringScreen,
          //   }),
        },
      }}
    >
      
      <DrawerHeader sx={{ py: 3, px: 0, }}>
      <Divider sx={{ borderColor: '#FFFFFF', mx:1 }} />
        <Box
          sx={{
            width: "80px",
            height: "80px",
            // transform: sideBarOpen ? "scale(1)" : "scale(0.6)",
            // transition: (theme) =>
            //   theme.transitions.create("transform", {
            //     easing: theme.transitions.easing.easeOut,
            //     duration: theme.transitions.duration.complex,
            //   }),
            
          }}
        >
          <Image
            src="/static/logo/vigil.png"
            width={100}
            height={100}
            layout="responsive"
            alt="Sidebar Logo"
            priority
          />

          
        </Box>
       
      </DrawerHeader>

      <div>
        {Routes.map((item, key) => (
          <MenuItem key={key} item={item} />
        ))}
        {userID && (
          <ListFooter>
            {BottomRoutes.map((item, key) => (
              <MenuItem key={key} item={item} />
            ))}
          </ListFooter>
        )}
       
      </div>
      {/* <DrawerFooter>
        {sideBarOpen && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, color: "#FFFFFF", opacity: 0.7 }}
            onClick={() => setSidebarOpen(!sideBarOpen)}
          >
            Hide Sidebar
          </Typography>
        )}
        <IconButton
          onClick={() => setSidebarOpen(!sideBarOpen)}
          sx={{
            color: "#FFFFFF",
            opacity: 0.7,
            transform: sideBarOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: (theme) =>
              theme.transitions.create("transform", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.complex,
              }),
          }}
        >
          <DoubleArrowIcon />
        </IconButton>
      </DrawerFooter> */}
    </Drawer>
  );
};

export default Sidebar;
