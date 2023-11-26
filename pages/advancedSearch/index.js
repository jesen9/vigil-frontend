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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const IndexPage = ({ onSelectLetter }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const today = dayjs();

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
        <List sx={{ width: '100%', bgcolor: 'background.paper' , padding:'1px', border:'1px solid red'}}>
        <ListItem>
          
          <Grid container direction={'column'} spacing={2} justifyContent="space-between">
          <ListItemText primary="Published Dates" />


          <Grid container spacing={2} justifyContent="space-between">
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

          <Grid container direction={'column'} spacing={2} justifyContent="space-between">
          <ListItemText primary="Published Dates" />


          <Grid container spacing={2} justifyContent="space-between">
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
        </ListItem>
          <ListItem>
            <ListItemText primary="CWE ID" />
          </ListItem>

          <ListItem>{/* Add your content here */}</ListItem>
        </List>
      </Grid>




      {/* Add your content based on the selected letter */}
    </Box>
  );
};

export default IndexPage;
