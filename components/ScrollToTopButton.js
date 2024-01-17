import React, { useState, useEffect } from 'react';
import { IconButton, Fab, Paper, Button, Arrow, Box, Tooltip,  Fade, TextField, Dialog, DialogActions, DialogContent, Popper,DialogContentText, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButt } from '@mui/material';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const ScrollToTopButton = ({children}) => {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notes, setNotes] = useState('');
  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;
  const hasNotesContent = notes !== null && notes !== "";
  // const classes = useStyles();



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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Implement your save logic here
    console.log('Notes saved:', notes);
    setOpen(false);
  };


  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',   }}>
        <Tooltip title="Scroll to top">
        <Fab color="primary" aria-label="add" onClick={handleScrollToTop}  size="small" sx={{ mb:2,backgroundColor: '#8EB4F4' }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>

        <Fab color="secondary" variant="extended" aria-label="add" sx={{ backgroundColor: '#C2212B', mb: 1}} onClick={handleClick}  >
          <CreateIcon  sx={{ mr: 1}}/>
          Note
        </Fab>
    
      
      <Popper id={id} open={open} anchorEl={anchorEl} transition 
      >
        {({ TransitionProps }) => (
          <>
            
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
              <Box sx={{ p: 2, width: '300px' }}>
             
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  rows={7}
                  placeholder="Write your notes here"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="error" onClick={handleCancel} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </Box>
              </Box>
              </Paper>
            
            </Fade>
          </>
        )}
      </Popper>

    </div>
  );
};

export default ScrollToTopButton;
