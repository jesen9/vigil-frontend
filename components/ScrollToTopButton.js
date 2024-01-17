import React, { useState, useEffect } from 'react';
import { IconButton, Fab, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButt } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotesIcon from '@mui/icons-material/Notes'; 
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import InfoIcon from '@mui/icons-material/Info';
import { makeStyles } from '@mui/styles';
import NoteIcon from '@mui/icons-material/Note';
import DescriptionIcon from '@mui/icons-material/Description';// Assuming you have a Notes icon
import Draggable from 'react-draggable';

const ScrollToTopButton = ({children}) => {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const showButtonThreshold = 400;

      setIsVisible(scrollY > showButtonThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleOpenNotes = () => {
    // Add logic to handle opening notes
    console.log('Open Notes clicked');
    // You can implement the logic to open notes here
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',   }}>
        <Tooltip title="Scroll to top">
        <Fab color="primary" aria-label="add" onClick={handleScrollToTop}  size="small" sx={{ mb:2,backgroundColor: '#8EB4F4' }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>

      <Tooltip title="Note" >
        <Fab color="secondary" variant="extended" aria-label="add" sx={{ backgroundColor: '#C2212B', mb: 1}} onClick={toggleDrawer} >
          <CreateIcon  sx={{ mr: 1}}/>
          Note
        </Fab>
      </Tooltip>
      
    

      <Drawer
        // className={classes.drawer}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer}
        style={{ position: 'absolute'  }}
        hideBackdrop = {true} 
      >
         <List>
          <ListItem button onClick={toggleDrawer}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={toggleDrawer}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
     

    </div>
  );
};

export default ScrollToTopButton;
