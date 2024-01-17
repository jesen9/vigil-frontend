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
import api from "../../services/api"
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
  const [cvelist, setCvelist] = React.useState([]);
  const cveId = router.query.cveId 
  const cvssV3Severity = router.query.cvss
  const cweId = router.query.cweId 
  const pubStartDate = router.query.startdate
  const pubEndDate = router.query.enddate
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const debounceMountCVEList = useCallback(
    debounce(mountCVEList, 400),
    []
  );

  const handleStartDateChange = (newStartValue) => {
    setStartDate(newStartValue);
  };

  async function mountCVEList() {
    try {
        const queryParams = {
            cpename,
            cveId,
            cvssV3Metrics,
            cvssV3Severity,
            cweId,
            hasCertAlerts,
            hasCertNotes,
            hasKev,
            hasOval,
            isVulnerable,
            keywordExactMatch,
            keywordSearch,
            virtualMatchString,
            noRejected,
            resultsPerPage,
            startIndex,
            sourceIdentifier,
          };

      setIsModalLoading(true);

      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([key, value]) => value !== undefined && value !== null)
      );

      const queryString = new URLSearchParams(filteredParams).toString();

      const getcveList = await api.getCVEList(queryString)
      const { data } = getAllProcessType;
      console.log('data', data)
      setCvelist(data.data)
      setIsModalLoading(false);
      //   setIsModalAddProcessTypeOpen(false);
    } catch (error) {
      setIsModalLoading(true);
      displayToast("error", "Failed to Fetch Factory Details Data");
      console.log(error);
    }
  }

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
