import {
    Box,
    Grid,
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
    Paper,
    Divider,
    Stack,
    Autocomplete,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from "@mui/material";
  import React, { useCallback, useEffect, useState } from "react";
  import { debounce } from "lodash";
  import { useRouter } from 'next/router';
  import AddIcon from "@mui/icons-material/Add";
  import ViewListIcon from "@mui/icons-material/ViewList";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import SearchIcon from "@mui/icons-material/Search";
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  import dayjs, { Dayjs } from 'dayjs';
  import Image from 'next/image';
  import { color } from "@mui/system";
  import vigil from "../../public/static/logo/Vigil.png";
  
  
  function factoryclassification() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const router = useRouter();
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [CVEID, setCVEID] = React.useState(null);
    const [cvss, setCvss] = React.useState(null);
    const [cvssV2, setCvssV2] = React.useState(null);
    const [cvssV3, setCvssV3] = React.useState(null);
    const today = dayjs();
    const cvssVersion = ['cvssV2', 'cvssV3'];
   
   
    const [selectedVersion, setSelectedVersion] = useState("");
    const [cvssOptions, setCvssOptions] = useState([]);
  
  
    const handleVersionChange = (event) => {
      const version = event.target.value;
      setSelectedVersion(version);
    
      const newCvssOptions = getOptionsForVersion(version);
  
      setCvssOptions(newCvssOptions);
    };
  
    // console.log("halo", selectedVersion, cvss);
  
    const handleCvssChange = (event) => {
      const newValue = event.target.value;
      setCvss(newValue);
      if (selectedVersion === "cvssV2") {
        setCvssV2(newValue);
      }
      else
        setCvssV3(newValue);
      // Handle the change of cvss value here
    };
  
    const getOptionsForVersion = (version) => {
      // Example logic, replace with your implementation
      if (version === "cvssV2") {
        return ["LOW", "MEDIUM", "HIGH"];
      } else if (version === "cvssV3") {
        return ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
      } else {
        return []; // Default or handle other cases
      }
    };
  
    const handleStartDateChange = (newStartValue) => {
      setStartDate(newStartValue);
    };
  
    const handleEndDateChange = (newStopValue) => {
      if (startDate) {
        const maxEndDate = dayjs(startDate).add(120, 'days');
        if (dayjs(newStopValue).isAfter(maxEndDate)) {
          // If the selected EndDate is more than 120 days from startDate, reset it
          setEndDate(null);
          alert('The range between start date and stop date should not be more than 120 days.');
        } else {
          setEndDate(newStopValue);
        }
      } else {
        // If there is no startDate selected, set the EndDate directly
        setEndDate(newStopValue);
      }
    };
  
    const handleClick = () => {
      const formatDate = (date) => date && date.$d.toISOString();
  
      if ((!startDate && endDate) || (startDate && !endDate)) {
        alert('Please enter both start date and end date');
        return;
      }
    
      const queryParams = [
        CVEID !== null && `cveId=${encodeURIComponent(CVEID)}`,
        cvssV2 !== null && `cvssV2Severity=${encodeURIComponent(cvssV2)}`,
        cvssV3 !== null && `cvssV3Severity=${encodeURIComponent(cvssV3)}`,
        formatDate(startDate) && `pubStartDate=${encodeURIComponent(formatDate(startDate))}`,
        formatDate(endDate) && `pubEndDate=${encodeURIComponent(formatDate(endDate))}`,
      ].filter(Boolean).join('&');
    
      const url = `/cvelist${queryParams ? `?${queryParams}` : ''}`;
    
  
      router.push(url);
    };
    
    console.log("cveid", CVEID);
    
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Grid container justifyContent="center" alignItems="center" sx={{mb:2}}>
          <Image 
            src="/static/logo/Vigil.png"
            alt="Description of the image"
            priority
            width={150}
            height={150}
            // include other necessary props like width and height
            />
            
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
                <Button size="small" variant="contained">Update Vigil Database</Button>
            </CardActions>
        </Card>
        
      </Box>
    );
  }
  
  export default factoryclassification;
  