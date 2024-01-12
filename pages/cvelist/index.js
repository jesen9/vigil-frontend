import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableBody,
  TextField,
  IconButton,
  Button,
  Paper,
  Divider,
  TableFooter,
  TablePagination,
  Badge,
  Modal,
  Autocomplete,
  Stack,
  FAB,
  Alert,
  Chip,
  AlertTitle,
  CircularProgress,
  Pagination,
  List,
  ListItemButton,
  ListItemText,
  ListItem, 
} from "@mui/material";
import { debounce, result } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
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
import useToast from "../../utils/toast";


const factoryclassification= () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [cvelist, setCvelist] = React.useState([]);
  const cveId = router.query.cveId 
  const cvssV3Severity = router.query.cvss
  const cweId = router.query.cweId 
  const pubStartDate = router.query.startdate
  const pubEndDate = router.query.enddate
  const [startIndex, setStartIndex] = React.useState(1);
  const [resultsPerPage, setResultPerPage] = React.useState(20);
  const [totalResult, setTotalResult] = React.useState(null);

  const debounceMountCVEList = useCallback(
    debounce(mountCVEList, 400),
    []
  );

  const handleStartDateChange = (newStartValue) => {
    setStartDate(newStartValue);
  };

  // console.log("router query", router.query);

  async function mountCVEList(params, resultsPerPage, startIndex) {
    try {
      console.log("mountCVEList", params, resultsPerPage, startIndex)
      setIsModalLoading(true);

      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([key, value]) => value !== undefined && value !== null && value !== "null")
      );
      
      // console.log("filteredParams", filteredParams)
      const getcveList = await api.getCVEList(filteredParams, resultsPerPage, startIndex- 1);
      const { data } = getcveList;
      console.log('dataaaa', data)
      setCvelist(data.cvelist)
      setTotalResult(data.totalResults);
      setIsModalLoading(false);
      //   setIsModalAddProcessTypeOpen(false);
    } catch (error) {
      setIsModalLoading(false);
      displayToast("error", "Failed to Fetch Factory Details Data");
      console.log(error);
    }
  }
  console.log("totalResult", totalResult)

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountCVEList(router.query, resultsPerPage, startIndex);
  }, [router.isReady]);

  const handleIndexChange = (event, newIndex) => {
    if (startIndex === newIndex) {
      return;
    }
    setStartIndex(newIndex);
    console.log("newindex",newIndex);
   debounceMountCVEList(router.query, resultsPerPage, newIndex);
  };


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
        <List sx={{ mb: 2 }}>
          {cvelist && cvelist.length > 0 ? (
            cvelist.map((cveItem, index) => (
              <Paper elevation={3} sx={{ backgroundColor: 'white', mb: 2, padding: 2 }} key={index}>
                <ListItemButton onClick={() => router.push(`/cvelist/${cveItem.cveid}`)}>
                  <ListItemText
                    primary={cveItem.cveid}
                    secondary={cveItem.description}
                    primaryTypographyProps={{ variant: 'h6' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItemButton>
                <Divider />
                <ListItem>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ListItemText primary="Published At" secondary={cveItem.publishedat} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemText primary="Updated At" secondary={cveItem.updatedat} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemText primary="CVSS Score" secondary={cveItem.cvssscore} />
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
            ))
          ) : (
            <List>
              <ListItem>
                <ListItemText primary="No CVEs available" />
              </ListItem>
            </List>
          )}
        </List>




    </Grid>
    <Stack spacing={2} alignItems={'center'}>
      <Pagination count={Math.ceil(totalResult / resultsPerPage)} page={startIndex} onChange={handleIndexChange} color="primary" size="large" />
     
    </Stack>
      <Divider sx={{ my: 2 }} />

            {/* ------------------------------------ MODAL LOADING ------------------------------------ */}

            <Modal open={isModalLoading} onClose={() => setIsModalLoading(false)}>
        {/* <ModalWrapper> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // width: 750,
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" size={50} thickness={4} />
          </Box>
        {/* </ModalWrapper> */}
      </Modal>
      
    </Box>
  );
}

export default factoryclassification;
