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
import { color } from "@mui/system";


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
      const maxEndDate = dayjs(startDate).add(30, 'days');
      if (dayjs(newStopValue).isAfter(maxEndDate)) {
        // If the selected EndDate is more than 30 days from startDate, reset it
        setEndDate(null);
        alert('The range between start date and stop date should not be more than 30 days.');
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
      <Grid container justifyContent="space-between">
        <Grid item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            CVE FILTERING
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Paper elevation={3}>
       
     
        <Grid
                container
                item
                sx={{
                  // boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                  // borderRadius: '8px',
                  overflow: 'hidden',
                  padding:'20px',
                
              }}
                justifyContent={"space-between"}
              //  spacing={2}
              
              >
                  <Box>
                  <Typography sx={{ fontWeight: 600, fontSize:'20px' }}>CVE ID</Typography>
                  </Box>
                  
                

                  <Grid item xs={10} >
                  <TextField
                  placeholder="Insert CVE ID"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setCVEID(e.target.value)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                  </Grid>
              </Grid>

              <Grid
              container
              item
              sx={{
                // boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                // borderRadius: '8px',
                overflow: 'hidden',
                padding:'20px',
            }}
              justifyContent={"space-between"}
            
            >
                <Box>
                <Typography sx={{ fontWeight: 600 ,fontSize:'20px'}}>Dates</Typography>
                </Box>
                
              

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container xs={10}  justifyContent={'space-between'}>
                    <Grid item xs={5.5} >
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        maxDate={today}
                        disabled={CVEID !== null && CVEID !== ""}  
                        renderInput={(params) => (
                          <TextField {...params} size="small" fullWidth/>
                        )}
                        format="DD-MM-YYYY"
                        
                      />
                    </Grid >
                    <Grid  item xs={5.5}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        maxDate={today}
                        // minDate={startDate}
                        disabled={CVEID !== null && CVEID !== ""}  
                        renderInput={(params) => (
                          <TextField {...params} size="small" fullWidth/>
                        )}
                        sx={{ width: '100%' }}
                        format="DD-MM-YYYY"
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
            </Grid>

            <Grid
              container
              item
              
              sx={{
                // boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                // borderRadius: '8px',
                overflow: 'hidden',
                padding:'20px',
            }}
              justifyContent={"space-between"}
            
            >

                <Box>
                <Typography sx={{ fontWeight: 600, fontSize:'20px' }}>CVSS</Typography>
                </Box>
                
                <Grid container xs={10}  justifyContent={'space-between'}>
                  <Grid item xs={5.5} >
                  <FormControl fullWidth>
                  <InputLabel id="version">Version</InputLabel>
                    <Select
                      labelId="version-label"
                      id="version"
                      value={selectedVersion}
                      onChange={handleVersionChange}
                      disabled={CVEID !== null && CVEID !== ""}  
                      // label="Select Version"
                    >
                      <MenuItem value="cvssV2">cvssV2</MenuItem>
                      <MenuItem value="cvssV3">cvssV3</MenuItem>
                      {/* Add other version options as needed */}
                    </Select>
                  </FormControl>
                 
                  </Grid>

                  <Grid item xs={5.5} >
                  <FormControl fullWidth>
                  <InputLabel id="cvss">Severity</InputLabel>
                    <Select
                      labelId="cvss-label"
                      id="cvss"
                      value={cvss}
                      onChange={handleCvssChange}
                      disabled={CVEID !== null && CVEID !== ""}  
                    >
                      {cvssOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  </Grid>
                </Grid>

               
                
            
            </Grid>

            <Grid
              container
              item
              sx={{
                padding: '30px',
              }}
              direction={'row-reverse'}  // Change 'flex-end' to 'row-reverse'
            >
              <Grid item >
                <Button
                  variant="contained"
                  size="large"  // Change 'Large' to 'large'
                  sx={{backgroundColor:'#8EB4F4'}}
                  onClick={
                    handleClick
                  }
                  startIcon={ <SearchIcon />}
                >
                 
                  Search
                </Button>
              </Grid>
            </Grid>
            

          
          </Paper>
      <Divider sx={{ my: 2 }} />
      
    </Box>
  );
}

export default factoryclassification;
