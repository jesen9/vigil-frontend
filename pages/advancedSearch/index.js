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
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select, 
  MenuItem, 
  FormGroup,
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
  const router = useRouter();
  const [CWEID, setCWEID] = React.useState(null);
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [keyword, setKeyword] = React.useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [CPE, setCPE] = useState({
    type:"*",
    vendor:"*",
    product:"*",
    version:"*",
  }); 

  const [selectedOptionsV3, setSelectedOptionsV3] = useState({
    AV: [],
    AC: [],
    S: [],
    UI: [],
    PR: [],
    C: [],
    I: [],
    A: [],
  });

  const [selectedOptionsV2, setSelectedOptionsV2] = useState({
    AV: [],
    AC: [],
    Au: [],
    C: [],
    I: [],
    A: [],
  });



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

  const handleCheckboxChange = (category, value) => {
    setSelectedOptionsV3((prevSelectedOptions) => {
      // Check if the checkbox is checked or unchecked
      if (prevSelectedOptions[category].includes(value)) {
        // If checked, remove the value from the array
        return {
          ...prevSelectedOptions,
          [category]: prevSelectedOptions[category].filter((item) => item !== value),
        };
      } else {
        // If unchecked, add the value to the array
        return {
          ...prevSelectedOptions,
          [category]: [...prevSelectedOptions[category], value],
        };
      }
    });
  };
  

  const handleCheckboxChangeV2 = (category, value) => {
    setSelectedOptionsV2((prevOptions)  => {
      const updatedOptions = { ...prevOptions };

      if (value) {
        // Add the selected value to the array
        updatedOptions[category].push(value);
      } else {
        // Remove the value from the array
        updatedOptions[category] = updatedOptions[category].filter((item) => item !== value);
      }

      return updatedOptions;
    });

  };


  const handleVersionChange = (event) => {
    const version = event.target.value;
  
    // Reset the checkbox arrays based on the selected version
    if (version === 'cvssV3') {
      setSelectedOptionsV2({
        AV: [],
        AC: [],
        Au: [],
        C: [],
        I: [],
        A: [],
      });
    } else if (version === 'cvssV2') {
      setSelectedOptionsV3({
        AV: [],
        AC: [],
        S: [],
        UI: [],
        PR: [],
        C: [],
        I: [],
        A: [],
      });
    }
  
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
      alert('Please insert both start date and end date in Published Date');
      return;
    }

    // if  ((!upStartDate && upEndDate) || (upStartDate && !upEndDate)) {
    //   alert('Please insert both start date and end date in Update Date');
    //   return;
    // }

    if (selectedVersion.length > 0 && (!selectedOptionsV2.A && !selectedOptionsV2.AC && !selectedOptionsV2.AV && !selectedOptionsV2.Au && !selectedOptionsV2.C && !selectedOptionsV2.I) && (!selectedOptionsV3.A && !selectedOptionsV3.AC && !selectedOptionsV3.AV && !selectedOptionsV3.S && !selectedOptionsV3.C && !selectedOptionsV3.I && !selectedOptionsV3.PR && !selectedOptionsV3.UI)) {
      alert('Please insert CVSS Metrics');
      return;
    }

    let cvssParam;
    let urlPrefix;

    if (selectedOptionsV3 && Object.values(selectedOptionsV3).some(category => category.length > 0)) {
     
      cvssParam = Object.entries(selectedOptionsV3)
        .filter(([category, values]) => values.length > 0)
        .map(([category, values]) => values.map(value => `${category}:${value}`).join('/'))
        .join('/');
        urlPrefix = 'cvssV3Metrics=';
    } else {
      // Use selectedOptionsV2 if selectedOptionsV3 is null or empty
      cvssParam = Object.entries(selectedOptionsV2)
        .filter(([category, values]) => values.length > 0)
        .map(([category, values]) => values.map(value => `${category}:${value}`).join('/'))
        .join('/');
        urlPrefix = 'cvssV2Metrics=';
    }

    console.log("isupdate", isUpdated)
    const queryParams = [
      cvssParam && `${urlPrefix}${cvssParam}`,
      isUpdated  && `isUpdated=${isUpdated}`,
      formatDate(startDate) && `pubStartDate=${encodeURIComponent(formatDate(startDate))}`,
      formatDate(endDate) && `pubEndDate=${encodeURIComponent(formatDate(endDate))}`,
      // formatDate(upStartDate) && `lastModStartDate=${encodeURIComponent(formatDate(upStartDate))}`,
      // formatDate(upEndDate) && `lastModEndDate=${encodeURIComponent(formatDate(upEndDate))}`,
      CWEID !== null && `cweId=${encodeURIComponent(CWEID)}`,
      keyword !== null && `keywordSearch=${encodeURIComponent(keyword)}`,
      CPE.type !== "*" && CPE.vendor !== "*" && CPE.product !== "*" && CPE.version !== "*" &&
      `virtualMatchString=cpe:2.3:${CPE.type}:${CPE.vendor}:${CPE.product}:${CPE.version}`,
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
                <ListItemText primary="Keyword" />
                <TextField
                  placeholder="CVE ID, Vendor, Product..."
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setKeyword(e.target.value)}
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
                <ListItemText primary="Part/Type" />
                <FormControl fullWidth size="small">
                    <Select
                      labelId="version-label"
                      id="version"
                      value={CPE.type}
                      onChange={(e) => setCPE((prevCPE) => ({ ...prevCPE, type: e.target.value }))}
                      // label="Select Version"
                    >
                      <MenuItem value="*">All</MenuItem>
                      <MenuItem value="a">Applications</MenuItem>
                      <MenuItem value="h">Hardware</MenuItem>
                      <MenuItem value="0">Operating System</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Vendor" />
                <TextField
                  placeholder="exact match , eg. google"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setCPE((prevCPE) => ({ ...prevCPE, vendor: e.target.value }))}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
              </Grid>

              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Product" />
                <TextField
                  placeholder="exact match , eg. android"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setCPE((prevCPE) => ({ ...prevCPE, product: e.target.value }))}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
              </Grid>

              <Grid item direction={'column'} spacing={2} width={'100%'}>
                <ListItemText primary="Version" />
                <TextField
                  placeholder="exact match, eg. 11.0"
                      required
                      id="outlined-required"
                      fullWidth
                      size="small"
                      onChange={(e) => setCPE((prevCPE) => ({ ...prevCPE, version: e.target.value }))}
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
          <ListItemText primary="Publish Date" />


          <Grid container spacing={2} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
                
            <FormControlLabel  control={<Checkbox size='small' onChange={() => setIsUpdated(!isUpdated)} disabled= {!startDate || !endDate}/>} label="Is updated" />
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
             
            </Stack>
          </ListItem>
          
          <ListItem>
            <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
              <Grid item direction={'column'} spacing={2} width={'100%'}>
              <ListItemText primary="CVSS Version" />
              <FormControl fullWidth size="small">
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
            </Stack>
          </ListItem>
          
          {selectedVersion === 'cvssV3' && (
            <>
              <ListItem>
                <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
                <Grid item direction={'column'} spacing={2} width={'100%'}> 
                    <ListItemText primary="Attack Vector" />
                    <FormGroup>
                        <FormControlLabel        control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('AV', 'P')} />} label="Physical" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('AV', 'L')}/>} label="Local" />
                        <FormControlLabel control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('AV', 'A')}/>}  label="Adjacent network" />
                        <FormControlLabel control={<Checkbox size='small'  onChange={(e) => handleCheckboxChange('AV', 'N')}/>} label="Network" />
                    </FormGroup>
                </Grid> 
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Attack Complexity" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('AC', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('AC', 'H')}/>} label="High" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Scope" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('S', 'U')}/>} label="Unchanged" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('S', 'C')}/>} label="Changed" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="User Interaction" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small'
                        onChange={(e) => handleCheckboxChange('UI', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('UI', 'R')}/>} label="Required" />
                    </FormGroup>
                  </Grid>
                </Stack>
              </ListItem>

              <ListItem>
                <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Privileges Required" />
                    <FormGroup>
                    <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('PR', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('PR', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('PR', 'H')}/>} label="High" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Confidentiality" />
                    <FormGroup>
                    <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('C', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('C', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('C', 'H')}/>} label="High" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Integrity" />
                    <FormGroup>
                    <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('I', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('I', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('I', 'H')}/>} label="High" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Availability" />
                    <FormGroup>
                    <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('A', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('A', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChange('A', 'H')}/>} label="High" />
                    </FormGroup>
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
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('AV', 'L')}/>} label="Local" />
                        <FormControlLabel control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('AV', 'A')}/>}  label="Adjacent network" />
                        <FormControlLabel control={<Checkbox size='small'/>} label="Network" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Access Complexity" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('AC', 'L')}/>} label="Low" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('AC', 'M')}/>} label="Medium" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('AC', 'H')}/>} label="High" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Authentication" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('Au', 'M')}/>} label="Multiple" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('Au', 'S')}/>} label="Single" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('Au', 'N')}/>} label="None" />
                    </FormGroup>
                  </Grid>
                </Stack>
              </ListItem>

              <ListItem>
                <Stack direction={{ xs: 'column', sm: 'row' }} width={'100%'} spacing={2} >
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Confidentiality" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('C', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('C', 'P')}/>} label="Partial" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('C', 'C')}/>} label="Complete" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Integrity" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('I', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('I', 'P')}/>} label="Partial" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('I', 'C')}/>} label="Complete" />
                    </FormGroup>
                  </Grid>
                  <Grid item direction={'column'} spacing={2} width={'100%'}>
                    <ListItemText primary="Availability" />
                    <FormGroup>
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('A', 'N')}/>} label="None" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2('A', 'P')}/>} label="Partial" />
                        <FormControlLabel  control={<Checkbox size='small' onChange={(e) => handleCheckboxChangeV2  ('A', 'C')}/>} label="Complete" />
                    </FormGroup>
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

    </Box>
  );
};

export default IndexPage;
