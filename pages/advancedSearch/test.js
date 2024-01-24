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
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';

const IndexPage = ({ onSelectLetter }) => {
  const today = dayjs();
  const router = useRouter();
  const [CWEID, setCWEID] = React.useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
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

  const [selectedOptionMetrics, setSelectedOptionMetrics] = useState([])
  console.log('testing', selectedOptionsV3)

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
  

 

  const handleClick = () => {
    let queryParams;
  
    if (selectedOptionsV3 && Object.values(selectedOptionsV3).some(category => category.length > 0)) {
      // Use selectedOptionsV3 if it is not null and has non-empty categories
      queryParams = Object.entries(selectedOptionsV3)
        .filter(([category, values]) => values.length > 0)
        .map(([category, values]) => values.map(value => `${category}:${value}`).join('/'))
        .join('/');
    } else {
      // Use selectedOptionsV2 if selectedOptionsV3 is null or empty
      queryParams = Object.entries(selectedOptionsV2)
        .filter(([category, values]) => values.length > 0)
        .map(([category, values]) => values.map(value => `${category}:${value}`).join('/'))
        .join('/');
    }
  
    console.log("Desired format", queryParams);
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
