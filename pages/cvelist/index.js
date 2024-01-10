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
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Pagination,
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
  const router = useRouter();
  // const cveId = router.query.cveId;
  // const cvss = router.query.cvss;
  // const startDate = router.query.startDate;
  // const endDate = router.query.endDate;
  const queries = {
    cpename: router.query.cpename,
    cveId: router.query.cveId,
    cvssV3Metrics: router.query.cvssV3Metrics,
    cvssV3Severity: router.query.cvssV3Severity,
    cweId: router.query.cweId,
    hasCertAlerts: router.query.hasCertAlerts,
    hasCertNotes: router.query.hasCertNotes,
    hasKev: router.query.hasKev,
    hasOval: router.query.hasOval,
    isVulnerable: router.query.isVulnerable,
    keywordExactMatch: router.query.keywordExactMatch,
    keywordSearch: router.query.keywordSearch,
    virtualMatchString: router.query.virtualMatchString,
    noRejected: router.query.noRejected,
    resultsPerPage: router.query.resultsPerPage,
    startIndex: router.query.startIndex,
    sourceIdentifier: router.query.sourceIdentifier,
  }
  console.log('ini query router', router.query);
  
  /*const cpename = router.query.cpename ?? '';
  const cveId = router.query.cveId ?? '';
  const cvssV3Metrics = router.query.cvssV3Metrics ?? '';
  const cvssV3Severity = router.query.cvssV3Severity ?? '';
  const cweId = router.query.cweId ?? '';
  const hasCertAlerts = router.query.hasCertAlerts ?? '';
  const hasCertNotes = router.query.hasCertNotes ?? '';
  const hasKev = router.query.hasKev ?? '';
  const hasOval = router.query.hasOval ?? '';
  const isVulnerable = router.query.isVulnerable ?? '';
  const keywordExactMatch = router.query.keywordExactMatch ?? '';
  const keywordSearch = router.query.keywordSearch ?? '';
  const virtualMatchString = router.query.virtualMatchString ?? '';
  const noRejected = router.query.noRejected ?? '';
  const resultsPerPage = router.query.resultsPerPage ?? '';
  const startIndex = router.query.startIndex ?? '';
  const sourceIdentifier = router.query.sourceIdentifier ?? '';*/

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [startDate, setStartDate] = React.useState(null);
  // const [endDate, setEndDate] = React.useState(null);
  const today = dayjs();
  const options = ['Low', 'Medium', 'High',];

  // console.log('param', cveId, keywordSearch)


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
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  console.log(Array.isArray(Array.from(router.query)));
  console.log(Array.from(router.query));

  const [cvelist, setCvelist] = React.useState([]);
  React.useEffect(()=>{
    const getData = async () =>{
      // const query = await fetch(`http://localhost:8000/api/getcvelist?cpename=${cpename}&cveId=${cveId}&cvssV3Metrics=${cvssV3Metrics}&cvssV3Severity=${cvssV3Severity}&cweId=${cweId}&hasCertAlerts=${hasCertAlerts}&hasCertNotes=${hasCertNotes}&hasKev=${hasKev}&hasOval=${hasOval}&isVulnerable=${isVulnerable}&keywordExactMatch=${keywordExactMatch}&keywordSearch=${keywordSearch}&virtualMatchString=${virtualMatchString}&noRejected=${noRejected}&resultsPerPage=${resultsPerPage}&startIndex=${startIndex}&sourceIdentifier=${sourceIdentifier}`);
      const query = await fetch(`http://localhost:8000/api/getcvelist?keywordSearch=${queries.keywordSearch}&resultsPerPage=10&startIndex=0`);
      // Array.from(router.query).forEach(element => {
      //   console.log('ini element', element);
      // });

      // console.log(`http://localhost:8000/api/getcvelist?cpename=${cpename}&cveId=${cveId}&cvssV3Metrics=${cvssV3Metrics}&cvssV3Severity=${cvssV3Severity}&cweId=${cweId}&hasCertAlerts=${hasCertAlerts}&hasCertNotes=${hasCertNotes}&hasKev=${hasKev}&hasOval=${hasOval}&isVulnerable=${isVulnerable}&keywordExactMatch=${keywordExactMatch}&keywordSearch=${keywordSearch}&virtualMatchString=${virtualMatchString}&noRejected=${noRejected}&resultsPerPage=${resultsPerPage}&startIndex=${startIndex}&sourceIdentifier=${sourceIdentifier}`);
      const response = await query.json();
      // console.log('response from api', response);
      // console.log('ini fake data', cvelist);
      setCvelist(response);
    }
    getData();
    console.log('ni hasil cvelist', cvelist, cvelist.length);
  },[]);

  

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent="space-between">
        <Grid item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            CVE LIST 
          </Typography>
        </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
       
        <Grid container justifyContent="space-between">
        <List sx={{ mb: 2 }} >
        {cvelist.map(({ cveid, description, publishedat, updatedat, cvssscore }) => (
          <Paper elevation={3} sx={{ backgroundColor: 'white', mb: 2, padding: 2 }} key={cveid}>
            <ListItemButton  onClick={() => router.push(`/cvelist/${cveid}`)} >
              <ListItemText
                primary={cveid}
                secondary={description}
                primaryTypographyProps={{ variant: 'h6' }}  // Increase font size
                secondaryTypographyProps={{ variant: 'body1' }}  // Increase font size
              />
               
            </ListItemButton>
            <Divider />
            <ListItem>
                <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <ListItemText primary="Published At" secondary={publishedat} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ListItemText primary="Updated At" secondary={updatedat} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ListItemText primary="CVSS Score" secondary={cvssscore} />
                </Grid>
                </Grid>
            </ListItem>
          </Paper>
        ))}
      </List>


    </Grid>
    <Stack spacing={2} alignItems={'center'}>
      <Pagination count={10} page={page}  color="primary" size="large" />
     
    </Stack>
      <Divider sx={{ my: 2 }} />
      
    </Box>
  );
}

export default factoryclassification;
