import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, Fab, Paper, Button, Typography, Modal, CircularProgress,  Box, Tooltip,  Fade, TextField, Dialog,DialogContent, Popper,DialogContentText, DialogTitle, } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from "../services/api";
import useToast from "../utils/toast";
import EditIcon from '@mui/icons-material/Edit';
import ModalWrapper from "../components/ModalWrapper";
import ModalInputWrapper from "../components/ModalInputWrapper";
import CreateIcon from '@mui/icons-material/Create';
import { setStorage, getStorage, deleteStorage } from "../utils/storage";
import { debounce, delay, isNull, isUndefined } from "lodash";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";


const ScrollToTopButton = ({ value}) => {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [displayToast] = useToast();
  const userID = getStorage("user_id");
  const [anchorEl, setAnchorEl] = useState(null);
  // const [notes, setNotes] = useState('');
  const [notesContent, setnotesContent] = useState('');
  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;
  const [isEdit, setIsEdit] = useState(false);
  const cveID = value.cve_id
  
  console.log('value',  value)
  const handleSave = (data) => {
   
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
 

  const debounceMountInsertNotes = useCallback(
    debounce(mountInsertNotes, 400),
    []
  );

  
  async function mountInsertNotes(cveID, notesContent) {
    
    const notesData = {
      cveId : cveID,
      notes : notesContent,
    }
    console.log("notes", notesData);
    try {
      setIsModalLoading(true);
      const saveNotes = await api.insertNotes(notesData);
      if (saveNotes.status === 401) {
        localStorage.clear();
        displayToast("info", "Unauthorized, returning to login page");
        router.push("/login"); // Fixed the typo in changeRoute to router.push
      }
      const {data} = saveNotes;
      console.log("savenotes", data)
      if (data.status ==="Insert notes success!"){
        displayToast("success", data.status);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setOpen((previousOpen) => !previousOpen);
        setIsModalLoading(false);
        setOpenDialog(false);
      }
      else{
        displayToast("error", data.status);
        setOpen((previousOpen) => !previousOpen);
        setIsModalLoading(false);
        setOpenDialog(false);
      }    
      
    } catch (error) {
      console.log(error);
    }
  }

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
    setIsEdit(false);
  };

  const handleCancel = () => {
        setOpen(false);
        setnotesContent("");
  };

  const handleCancelEdit = () => {
    setOpen(false);
    setnotesContent("");
    setIsEdit(false);
};

  const handleEdit = () => {
    setIsEdit(true);
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


    
      {userID ?(
        value.notes ? (
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
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
                    defaultValue={value.notes}
                    InputProps={{
                      readOnly: !isEdit,
                    }}
                    onChange={(e) => setnotesContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  {!isEdit &&(
                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <IconButton onClick={handleEdit}>
                       <EditIcon/>
                     </IconButton>
                     </Box>
                  )}
                 
                 {isEdit && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="error" onClick={handleCancelEdit} sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                  </Box>
                )}
              </Box>
              </Paper> 
              </Fade>
            </>
          )}
        </Popper>

        ) : (
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
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
                    value={notesContent}
                    onChange={(e) => setnotesContent(e.target.value)}
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
        )
      ) : (

        <Popper id={id} open={open} anchorEl={anchorEl} transition >
          {({ TransitionProps }) => (
            <> 
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                <Box sx={{ p: 2, width: '300px' }}>
              
                <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
                  Feel free to explore this feature by logging in!
                </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => router.push(`/login`)}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
                </Paper>
              
              </Fade>
            </>
          )}
        </Popper>
      )}

      
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: "#dd2c00" }} align="center">
            {<ErrorOutlineRoundedIcon sx={{ fontSize: 60 }} />}
          </DialogTitle>
          <DialogContent>
          <DialogContentText
            sx={{ color: "text.secondary", pb: 1.2 }}
            align="center"
          >
             You are about to save this note from:
          </DialogContentText>

          <DialogContentText sx={{ color: "text.secondary" }} align="center">
            {cveID}
          </DialogContentText>

          <DialogContentText
            sx={{ color: "text.secondary", pt: 1.2 }}
            align="center"
          >
            Are you sure to save this note?
          </DialogContentText>
          </DialogContent>
          <DialogContent align="center">

          <Button
            sx={{ mx: 1 }}
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCloseDialog}
          >
            No
          </Button>

          <Button
            sx={{ mx: 1 }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => debounceMountInsertNotes(cveID, notesContent)}
          >
            Yes
          </Button>
        </DialogContent>

        </Dialog> 

          {/* ------------------------------------ MODAL LOADING ------------------------------------ */}

          <Modal open={isModalLoading} onClose={() => setIsModalLoading(false)}>
        {/* <ModalWrapper> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // width: 750,
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" size={50} thickness={4} />
          </Box>
        {/* </ModalWrapper> */}
      </Modal>

    </div>
  );
};

export default ScrollToTopButton;
