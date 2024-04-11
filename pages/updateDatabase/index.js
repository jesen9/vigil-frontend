import {
    Box,
    Grid,
    CircularProgress,
    Table,
    TableRow,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination, // Import TablePagination
    Typography,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    CardHeader,
    TextField,
    Button,
    Modal,
    Divider,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
  import React, { useCallback, useState } from "react";
  import useToast from "../../utils/toast";
  import ModalWrapper from "../../components/ModalWrapper";
  import ModalInputWrapper from "../../components/ModalInputWrapper";
  import { debounce } from "lodash";
  import Image from 'next/image';
  import { color, display } from "@mui/system";
  import vigil from "../../public/static/logo/Vigil.png";
  import api from "../../services/api";
  
  
  function UpdateDatabase() {
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [displayToast] = useToast();
    const handleUpdate = () => {
      setOpenUpdate(true);
    };
    const handleCloseUpdate = () => {
      setOpenUpdate(false);
    };
   
   
  

    const debounceMountUpdateDatabase = useCallback(
      debounce(mountUpdateDatabase, 400),
      []
    );

    async function mountUpdateDatabase() {
      try {
        setIsModalLoading(true);
    
        const updateDatabase = await api.getUpdateDatabase();
        const { data } = updateDatabase;
        console.log('dataaaa', data);
    
        const combinedStatus = data.message.toLowerCase();
    
        if (combinedStatus.includes("failed")) {
          setIsModalLoading(false);
          displayToast("info", data.message);
          setNoDataFound(true);
        } else {
          setIsModalLoading(false);
          displayToast("success", data.message);
        }
    
      } catch (error) {
        setIsModalLoading(false);
        displayToast("error", "Update Failed");
        console.log(error);
      }
    }
    
      
  
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Grid container justifyContent="center" alignItems="center" sx={{mb:2}}>
          {/* <Image 
            src="/static/logo/vigil.png"
            alt="Description of the image"
            priority
            width={150}
            height={150}
            // include other necessary props like width and height
            /> */}
            
            {/* <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5, mb: 2 }}>
              CVE FILTERING
            </Typography> */}
        </Grid>
  
        <Card sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
            <CardContent sx={{ overflow: "auto" }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mt: 1, mb: 2 }}>
                     Update Your Database Here!
                    </Typography>
                    <Divider/>
                    <Typography variant="body1" sx={{ fontWeight: 300, mt:2 }}>
                    Update your Vigil database by clicking the button below
                    <br />
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 300, mt:2 }}>
                    The database update process may take a while, so please be patient.
                    </Typography>
             
            </CardContent>
            <CardActions sx={{ overflow: "auto", m:1 }}>
                <Button size="small" variant="contained" onClick={handleUpdate}>Update Vigil Database</Button>
            </CardActions>
        </Card>

        <Dialog open={openUpdate} onClose={handleCloseUpdate}>
          <DialogTitle sx={{ color: "#dd2c00" }} align="center">
            {<ErrorOutlineRoundedIcon sx={{ fontSize: 60 }} />}
          </DialogTitle>
          <DialogContent>
          <DialogContentText
            sx={{ color: "text.secondary", pb: 1.2 }}
            align="center"
          >
            You are about to update your database.
          </DialogContentText>
          <DialogContentText
            sx={{ color: "text.secondary", pt: 1.2 }}
            align="center"
          >
            Are you sure you want to update the database?
          </DialogContentText>
          </DialogContent>
          <DialogContent align="center">

          <Button
            sx={{ mx: 1 }}
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCloseUpdate}
          >
            No
          </Button>

          <Button
            sx={{ mx: 1 }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => debounceMountUpdateDatabase()}
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
        
      </Box>
    );
  }
  
  export default UpdateDatabase;
  