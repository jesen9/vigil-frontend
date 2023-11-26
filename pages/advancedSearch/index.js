import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  ListItem,
  List,
  Divider,
  Stack,
  ListItemText,
  Pagination,
  ButtonGroup,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';

const IndexPage = ({ onSelectLetter }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const today = dayjs();
  const optionsAV = ['Network', 'Adjacent Network', 'Local', 'Physical'];
  const optionsAC = ['High', 'Low'];
  const optionsScope = ['Changed', 'Unchanged'];
  const optionsUI = ['Required', 'None'];
  const optionsUR = ['High', 'Low', 'None'];
  const optionsConfidentiality = ['High', 'Low', 'None'];
  const optionsIntegrity = ['High', 'Low', 'None'];
  const optionsAvailability = ['High', 'Low', 'None'];
  const router = useRouter();

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

  const handleSelectLetter = (letter) => {
    // Update the selected letter
    setSelectedLetter(letter);
    // Handle the selected letter (e.g., filter data based on the letter)
    onSelectLetter(letter);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Grid container justifyContent="space-between">
        <Grid item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Advanced Search
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container justifyContent="space-between">
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem>
          <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
          
          <Grid item direction={'column'} spacing={2} width={'100%'}>
          <ListItemText primary="Published Dates" />


          <Grid container spacing={2} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>
           </Grid>

          <Grid item direction={'column'} spacing={2} width={'100%'}>
          <ListItemText primary="Updated Dates" />


          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>
          </Grid>
          </Stack>
        </ListItem>

          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="CWE ID" />
                <TextField
                  placeholder="Insert CWE ID"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="CWE Name" />
                <TextField
                  placeholder="Insert CWE Name"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
              </Grid>
            </Stack>
          </ListItem>

          <ListItem>
          <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
          <Grid item direction={'column'} spacing={2} width={'100%'}>
          <ListItemText primary="Vendor" />
          <TextField
            placeholder="Insert Vendor"
                required
                id="outlined-required"
                fullWidth
                size="small"
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Grid>
          <Grid item direction={'column'} spacing={2} width={'100%'}>
          <ListItemText primary="Product" />
          <TextField
            placeholder="Insert Product"
                required
                id="outlined-required"
                fullWidth
                size="small"
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Grid>
          <Grid item direction={'column'} spacing={2} width={'100%'}>
          <ListItemText primary="Platform" />
          <TextField
            placeholder="Insert Platform"
                required
                id="outlined-required"
                fullWidth
                size="small"
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Grid>
          
          </Stack>
          </ListItem>
          
          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Attack Vector" />
                <Autocomplete
                  options={optionsAV}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Attack Complexity" />
                <Autocomplete
                  options={optionsAC}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Scope" />
                <Autocomplete
                  options={optionsScope}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="User Interaction" />
                <Autocomplete
                  options={optionsUI}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
            </Stack>
          </ListItem>

          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Privileges Required" />
                <Autocomplete
                  options={optionsUR}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Confidentiality" />
                <Autocomplete
                  options={optionsConfidentiality}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Integrity" />
                <Autocomplete
           
                  options={optionsIntegrity}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Availability" />
                <Autocomplete
           
                  options={optionsAvailability}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"  placeholder="Low"    />
                  )}
                />
              </Grid>
            </Stack>
          </ListItem>
          
          <ListItem>
            <Grid
                container
                item
                sx={{
                  py: '10px',
                }}
                direction={'row-reverse'}  // Change 'flex-end' to 'row-reverse'
              >
                <Grid item >
                  <Button
                    variant="contained"
                    size="large"  // Change 'Large' to 'large'
                    sx={{backgroundColor:'#8EB4F4'}}
                    onClick={() => {
                      router.push(`/cvelist`);
                    }}
                    startIcon={ <SearchIcon />}
                  >
                  
                    Search
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
        </List>
      </Grid>




      {/* Add your content based on the selected letter */}
    </Box>
  );
};

export default IndexPage;
