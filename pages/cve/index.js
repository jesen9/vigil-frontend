import * as React from "react";
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
} from "@mui/material";
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
  const today = dayjs();
  const options = ['Low', 'Medium', 'High',];

  const handleChange = (event, newValue) => {
    setCvss(newValue);
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
  
    const queryParams = [
      CVEID !== null && `cveId=${encodeURIComponent(CVEID)}`,
      cvss !== null && `cvssV3Severity=${encodeURIComponent(cvss)}`,
      formatDate(startDate) && `startDate=${encodeURIComponent(formatDate(startDate))}`,
      formatDate(endDate) && `endDate=${encodeURIComponent(formatDate(endDate))}`,
    ].filter(Boolean).join('&');
  
    const url = `/cvelist${queryParams ? `?${queryParams}` : ''}`;
  
    console.log('param', CVEID, cvss, startDate, endDate);
    router.push(url);
  };
  
  
  
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
                
              

                <Grid item xs={10} >
                <Autocomplete
           
                  options={options}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
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
