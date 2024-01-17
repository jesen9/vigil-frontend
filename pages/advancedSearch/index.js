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
  FormControl,
  InputLabel,
  Select, 
  MenuItem, 
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
  const [upStartDate, setUpStartDate] = React.useState(null);
  const [upEndDate, setUpEndDate] = React.useState(null);
  const today = dayjs();
  const optionsAV2 = ['Network', 'Adjacent Network', 'Local',];
  const optionsAC2 = ['High', 'Medium', 'Low'];
  const optionsConfidentiality2 = ['None', 'Partial', 'Complete'];
  const optionsIntegrity2 = ['None', 'Partial', 'Complete'];
  const optionsAvailability2 = ['None', 'Partial', 'Complete'];
  const optionsA2 = ['Multiple', 'Single', 'None',];
  const optionsAV = ['Network', 'Adjacent Network', 'Local', 'Physical'];
  const optionsAC = ['High', 'Low'];
  const optionsScope = ['Changed', 'Unchanged'];
  const optionsUI = ['Required', 'None'];
  const optionsUR = ['High', 'Low', 'None'];
  const optionsConfidentiality = ['High', 'Low', 'None'];
  const optionsIntegrity = ['High', 'Low', 'None'];
  const optionsAvailability = ['High', 'Low', 'None'];
  const router = useRouter();
  const [cvssOptions, setCvssOptions] = useState([]);
  const [cvss, setCvss] = React.useState(null);
  const [cvssV2, setCvssV2] = React.useState(null);
  const [cvssV3, setCvssV3] = React.useState(null);
  const [CWEID, setCWEID] = React.useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedOptionsV3, setSelectedOptionsV3] = useState({
    AV: null,
    AC: null,
    S: null,
    UI: null,
    PR: null,
    C: null,
    I: null,
    A: null,
  });

  const [selectedOptionsV2, setSelectedOptionsV2] = useState({
    AV: null,
    AC: null,
    Au: null,
    C: null,
    I: null,
    A: null,
  });

  const handleOptionChange = (field, newValue) => {
    const firstLetter = newValue ? newValue[0].toUpperCase() : null;
    setSelectedOptionsV3((prevOptions) => ({
      ...prevOptions,
      [field]: firstLetter,
    }));
  };

  const handleOptionChangeV2 = (field, newValue) => {
    const firstLetter = newValue ? newValue[0].toUpperCase() : null;
    setSelectedOptionsV2((prevOptions) => ({
      ...prevOptions,
      [field]: firstLetter,
    }));
  };

  const formatCVSSV3 = (options) => {
    const formattedOptions = Object.keys(options)
      .filter((key) => options[key] !== null)
      .map((key) => `${key}:${options[key]}`)
      .join('/');

    return `${formattedOptions}`;
  };

  const formatCVSSV2 = (options) => {
    const formattedOptions = Object.keys(options)
      .filter((key) => options[key] !== null)
      .map((key) => `${key}:${options[key]}`)
      .join('/');

    return `${formattedOptions}`;
  };


  const handleVersionChange = (event) => {
    const version = event.target.value;
    setSelectedVersion(version);
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

  const handleUpStartDateChange = (newStartValue) => {
    setUpStartDate(newStartValue);
  };

  const handleUpEndDateChange = (newStopValue) => {
    if (upStartDate) {
      const maxEndDate = dayjs(upStartDate).add(120, 'days');
      if (dayjs(newStopValue).isAfter(maxEndDate)) {
        // If the selected EndDate is more than 120 days from startDate, reset it
        setEndDate(null);
        alert('The range between start date and stop date should not be more than 120 days.');
      } else {
        setUpEndDate(newStopValue);
      }
    } else {
      // If there is no startDate selected, set the EndDate directly
      setUpEndDate(newStopValue);
    }
  };

  const handleClick = () => {
    const formatDate = (date) => date && date.$d.toISOString();

    if ((!startDate && endDate) || (startDate && !endDate)) {
      alert('Please enter both start date and end date in Published Date');
      return;
    }

    if  ((!upStartDate && upEndDate) || (upStartDate && !upEndDate)) {
      alert('Please enter both start date and end date in Update Date');
      return;
    }
  
    const queryParams = [
      Object.values(selectedOptionsV2).some((value) => value !== null) &&
    `cvssV2Metrics=${encodeURIComponent(formatCVSSV2(selectedOptionsV2))}`,
  Object.values(selectedOptionsV3).some((value) => value !== null) &&
    `cvssV3Metrics=${encodeURIComponent(formatCVSSV3(selectedOptionsV3))}`,
      formatDate(startDate) && `pubStartDate=${encodeURIComponent(formatDate(startDate))}`,
      formatDate(endDate) && `pubEndDate=${encodeURIComponent(formatDate(endDate))}`,
      formatDate(upStartDate) && `lastModStartDate=${encodeURIComponent(formatDate(upStartDate))}`,
      formatDate(upEndDate) && `lastModEndDate=${encodeURIComponent(formatDate(upEndDate))}`,
      CWEID !== null && `cweId=${encodeURIComponent(CWEID)}`,
    ].filter(Boolean).join('&');
  
    const url = `/cvelist${queryParams ? `?${queryParams}` : ''}`;
  

    router.push(url);
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
          <ListItemText primary="Publish Date" />


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
          <ListItemText primary="Update Date" />


          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={upStartDate}
                  onChange={handleUpStartDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                  format="DD-MM-YYYY"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={upEndDate}
                  onChange={handleUpEndDateChange}
                  maxDate={today}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                  sx={{ width: '100%' }}
                  format="DD-MM-YYYY"
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
                  placeholder="exact match , eg. CWE-798"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setCWEID(e.target.value)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
              </Grid>
              {/* <Grid item direction={'column'} spacing={2} width={'100%'}>
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
              </Grid> */}
            </Stack>
          </ListItem>

          {/* <ListItem>
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
          </ListItem> */}
          
          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
              <ListItemText primary="CVSS Version" />
              <FormControl fullWidth size="small">
                  <InputLabel id="cvss">Version</InputLabel>
                    <Select
                      labelId="version-label"
                      id="version"
                      value={selectedVersion}
                      onChange={handleVersionChange}
                      // label="Select Version"
                    >
                      <MenuItem value="cvssV2">cvssV2</MenuItem>
                      <MenuItem value="cvssV3">cvssV3</MenuItem>
                      {/* Add other version options as needed */}
                    </Select>
                  </FormControl>
              </Grid>
              {/* <Grid item direction={'column'} spacing={2} width={'100%'}>
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
              </Grid> */}
            </Stack>
          </ListItem>
          
          {selectedVersion === 'cvssV3' && (
        <>
          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Attack Vector" />
                <Autocomplete
                  options={optionsAV}
                  value={selectedOptionsV3.AV}
                onChange={(event, newValue) => handleOptionChange('AV', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"      />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Attack Complexity" />
                <Autocomplete
                  options={optionsAC}
                  value={selectedOptionsV3.AC}
                onChange={(event, newValue) => handleOptionChange('AC', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"      />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Scope" />
                <Autocomplete
                  options={optionsScope}
                  value={selectedOptionsV3.S}
                onChange={(event, newValue) => handleOptionChange('S', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="User Interaction" />
                <Autocomplete
                  options={optionsUI}
                  value={selectedOptionsV3.UI}
                onChange={(event, newValue) => handleOptionChange('UI', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
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
                  value={selectedOptionsV3.PR}
                onChange={(event, newValue) => handleOptionChange('PR', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"    />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Confidentiality" />
                <Autocomplete
                  options={optionsConfidentiality}
                  value={selectedOptionsV3.C}
                onChange={(event, newValue) => handleOptionChange('C', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  
                  renderInput={(params) => (
                    <TextField {...params} size="small"   />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Integrity" />
                <Autocomplete
           
                  options={optionsIntegrity}
                  value={selectedOptionsV3.I}
                onChange={(event, newValue) => handleOptionChange('I', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Availability" />
                <Autocomplete
           
                  options={optionsAvailability}
                  value={selectedOptionsV3.A}
                onChange={(event, newValue) => handleOptionChange('A', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
            </Stack>
          </ListItem>
        </>
        )}

{selectedVersion === 'cvssV2' && (
        <>
          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Access Vector" />
                <Autocomplete
                  options={optionsAV2}
                  value={selectedOptionsV2.AV}
                onChange={(event, newValue) => handleOptionChangeV2('AV', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Access Complexity" />
                <Autocomplete
                  options={optionsAC2}
                  value={selectedOptionsV2.AC}
                  onChange={(event, newValue) => handleOptionChangeV2('AC', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Authentication" />
                <Autocomplete
                  options={optionsA2}
                  value={selectedOptionsV2.Au}
                  onChange={(event, newValue) => handleOptionChangeV2('Au', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
            </Stack>
          </ListItem>

          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Confidentiality" />
                <Autocomplete
                  options={optionsConfidentiality2}
                  value={selectedOptionsV2.C}
                  onChange={(event, newValue) => handleOptionChangeV2('C', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                  
                  renderInput={(params) => (
                    <TextField {...params} size="small"     />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Integrity" />
                <Autocomplete
           
                  options={optionsIntegrity2}
                  value={selectedOptionsV2.I}
                  onChange={(event, newValue) => handleOptionChangeV2('I', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"   />
                  )}
                />
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Availability" />
                <Autocomplete
           
                  options={optionsAvailability2}
                  value={selectedOptionsV2.A}
                  onChange={(event, newValue) => handleOptionChangeV2('A', newValue)}
                  sx={{ backgroundColor: "white", width: "100%",}}
                  size="small"
                  fullWidth
                 
                  renderInput={(params) => (
                    <TextField {...params} size="small"    />
                  )}
                />
              </Grid>
            </Stack>
          </ListItem>
        </>
        )}

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
                    onClick={
                      handleClick
                    }
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
