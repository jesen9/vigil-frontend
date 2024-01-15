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
  TableBody,
  Card,
  CardContent,
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
  Link,
  IconButton, 
  Modal,
  CircularProgress,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useRouter } from 'next/router';
import useToast from "../../utils/toast";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from '@mui/icons-material/Reply';
import api from "../../services/api"
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";

const Comment = ({ username, date, content, onEdit, onDelete, onReply }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', marginTop: '8px' }}>
      <Typography variant="subtitle2" color="text.secondary">
        {username} - {date}
      </Typography>
      <Typography variant="body2">{content}</Typography>
      <IconButton onClick={onEdit} size="small">
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete} size="small">
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={onReply} size="small">
        <ReplyIcon />
      </IconButton>
    </div>
  );
};

// const cvedetail=
//     {
//         cveid:'CVE-2014-9174',
//         description:'Cross-site scripting (XSS) vulnerability in the Google Analytics by Yoast (google-analytics-for-wordpress) plugin before 5.1.3 for WordPress allows remote attackers to inject arbitrary web script or HTML via the "Manually enter your UA code" (manual_ua_code_field) field in the General Settings.',
//         cweid:'CWE-79',
//         cwename: "Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')",
//         cwedescription: "The product does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page that is served to other users.",
//         publishedat:' 2014-12-02 16:59:11',
//         updatedat:'2017-09-08 01:29:33',
//         cvssscore:[
//           {
//             "version": "3.1",
//             "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
//             "attackVector": "NETWORK",
//             "attackComplexity": "LOW",
//             "privilegesRequired": "NONE",
//             "userInteraction": "NONE",
//             "scope": "UNCHANGED",
//             "confidentialityImpact": "HIGH",
//             "integrityImpact": "HIGH",
//             "availabilityImpact": "HIGH",
//             "baseScore": 9.8,
//             "baseSeverity": "CRITICAL",
//             "source": "nvd@nist.gov",
//             "type": "Primary",
//             "exploitabilityScore": 3.9,
//             "impactScore": 5.9
//           },
//           {
//               "version": "3.0",
//               "vectorString": "CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
//               "attackVector": "NETWORK",
//               "attackComplexity": "LOW",
//               "privilegesRequired": "NONE",
//               "userInteraction": "NONE",
//               "scope": "CHANGED",
//               "confidentialityImpact": "HIGH",
//               "integrityImpact": "HIGH",
//               "availabilityImpact": "HIGH",
//               "baseScore": 10,
//               "baseSeverity": "CRITICAL",
//               "source": "support@hackerone.com",
//               "type": "Secondary",
//               "exploitabilityScore": 3.9,
//               "impactScore": 6
//           }
//         ],
//     }

//  const pocData =[
//     {
//       "title": "POC Title 1",
//       "description": "Description for POC 1",
//       "link": "https://example.com/poc1",
//       "comments": [
//         {
//           "username": "user1",
//           "date": "2023-01-01",
//           "content": "This is a sample comment for POC 1."
//         },
//       ]
//     },
//     {
//       "title": "POC Title 2",
//       "description": "Description for POC 2",
//       "link": "https://example.com/poc2"
//     },
//   ]


function factoryclassification () {
  const router = useRouter();
  const [displayToast] = useToast();
  const [isModalLoading, setIsModalLoading] = useState(false);
  const cveId = router.query.id
  const [startDate, setStartDate] = React.useState(null);
  const uniqueCWEIds = new Set();
  const [endDate, setEndDate] = React.useState(null);
  const today = dayjs();
  const options = ['Low', 'Medium', 'High',];
  const [newComment, setNewComment] = useState('');
  const [cveDetails, setCveDetails] = React.useState([]);
  const [cpe, setCPE] = React.useState([]);
  const [poc, setPOC] = React.useState([]);
  const [note, setNote] = React.useState([]);

  const debounceMountCVEDetails = useCallback(
    debounce(mountCVEDetails, 400),
    []
  );

  async function mountCVEDetails(cveId) {
    try {
      setIsModalLoading(true);
      const getcveDetails = await api.getCVEDetails(cveId);
      const { data } = getcveDetails;
      console.log('ini datanya ya', data)
      setCveDetails(data);
      setCPE(data.cpe)
      setPOC(data.poc)
      setIsModalLoading(false);
    } catch (error) {
      setIsModalLoading(false);
      displayToast("error", "Failed to Fetch CVE Details Data");
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log("halo gais")
    if (!router.isReady) return;
    debounceMountCVEDetails(router.query.id);
  }, [router.isReady]);


  const handleStartDateChange = (newStartValue) => {
    setStartDate(newStartValue);
  };

  const handleAddComment = () => {
    // Add logic to handle the addition of a new comment
    console.log('New Comment:', newComment);
    // You may want to update the comments array in your state or send it to a server.
    // For simplicity, we're just logging the new comment for now.
    setNewComment('');
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

  return (
    <Box sx={{ width: "100%", p: 3 }}>
       <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <IconButton aria-label="back" onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
            CVE Details
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      {/* {Array.isArray(cveDetails) && cveDetails.map((cvedetail, index) => ( */}
  <Grid  container component={Paper} sx={{ p: 2, marginBottom: 3 }} justifyContent={'space-between'} rowSpacing={1} elevation={7}>
    <Grid item>
      <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>
        {cveDetails.cveid}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 400, mt: 0.5 }}>
        {cveDetails.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
    </Grid>
    <Grid item xs={6}>
      <Typography variant="h6" sx={{ fontWeight: 300, mt: 0.5 }}>
        Published At: {cveDetails.publishedat}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="h6" sx={{ fontWeight: 300, mt: 0.5 }}>
        Updated At: {cveDetails.updatedat}
      </Typography>
    </Grid>
  </Grid>
{/* ))} */}

      

       {/* CVSS */}


      <Card sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
      <CardContent sx={{ overflow: "auto" }}>
       <Grid 
            container
            justifyContent={"space-between"}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ my: 1 }}
       >
           <Grid container item xs={4} alignItems="center"  >
             <Typography variant="h5" sx={{ fontWeight: 600}}>
               CVSS
             </Typography>
          
           </Grid>
         </Grid>
           <Paper>
            <TableContainer>
            <Table>
            <TableHead>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Version
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Version String
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Base Score
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Base Severity
              </TableCell>
            </TableHead>
              <TableBody>
              {cveDetails && cveDetails.cvssscore && cveDetails.cvssscore.map((cvss, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {cvss.version}
                    </TableCell>
                    <TableCell align="center">
                      {cvss.vectorString}
                    </TableCell>
                    <TableCell align="center">
                      {cvss.baseScore}
                    </TableCell>
                    <TableCell align="center">
                      {cvss.baseSeverity}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
           </Paper>
           </CardContent>
      </Card>


      {/* CWE */}
      <Card sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
      <CardContent sx={{ overflow: "auto" }}>
      <Grid   
      container
      justifyContent={"space-between"}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ my: 1 }}
      >
           <Grid container item xs={4} alignItems="center"  >
             <Typography variant="h5" sx={{ fontWeight: 600 }}>
               CWE IDs
             </Typography>
          
           </Grid>
         </Grid>
         
         {cveDetails && cveDetails.cwe && cveDetails.cwe.map((cwe, index) => {
            // Check if the cweid is unique; if not, skip rendering
            if (!uniqueCWEIds.has(cwe.cweid)) {
              uniqueCWEIds.add(cwe.cweid);
              if (cwe.cweid.startsWith("CWE")) {
                uniqueCWEIds.add(cwe.cweid);

                return (
                  <Grid key={index} container sx={{ p: 2, marginBottom: 3 }} component={Paper}>
                    <Grid item>
                      <Typography variant="h6" sx={{ fontWeight: 400, mt: 0.5 }}>
                        {cwe.cweid}
                      </Typography>
                      {/* ... (additional content related to cwe) */}
                    </Grid>
                  </Grid>
                );
              }
            }

            return null; // Skip rendering for duplicate cweid
          })}
        </CardContent>
      </Card>

      
      {/* CPE*/}
      <Card sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
      <CardContent sx={{ overflow: "auto" }}>
      <Grid container
            justifyContent={"space-between"}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ my: 1 }}
       >
           <Grid container item xs={4} alignItems="center"  >
             <Typography variant="h5" sx={{ fontWeight: 600}}>
               CPE
             </Typography>
          
           </Grid>
         </Grid>
           <Paper>
            <TableContainer>
            <Table>
            <TableHead>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                CPE Criteria
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Version Start
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Version End
              </TableCell>
            </TableHead>
            <TableBody>
                  {cveDetails && cveDetails.cpe && cveDetails.cpe.map((cpe, index) => (
                    <TableRow key={index}>
                    <TableCell align="center">
                      {cpe.criteria}
                    </TableCell>
                    <TableCell align="center">
                      {cpe.versionStartIncluding
                        ? `${cpe.versionStartIncluding} (including)`
                        : cpe.versionStartExcluding
                        ? `${cpe.versionStartExcluding} (excluding)`
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                    {cpe.versionEndIncluding
                        ? `${cpe.versionEndIncluding} (including)`
                        : cpe.versionEndExcluding
                        ? `${cpe.versionEndExcluding} (excluding)`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
           </Paper>
        </CardContent>
      </Card>

           
          {/* POC*/}
          <Card sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
      <CardContent sx={{ overflow: "auto" }}>
        <Grid container
            justifyContent={"space-between"}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ my: 1 }}
        >
          <Grid container item xs={4} alignItems="center" >
             <Typography variant="h5" sx={{ fontWeight: 600}}>
               POC
             </Typography>
          
           </Grid>
          </Grid>

          
          {/* {cvedetail.poc.map((poc, index) => ( */}
            <Card sx={{ borderRadius: 3, mb: 3 }}>
             
                <CardContent sx={{ overflow: "auto" }}>
                  <Typography variant="h5" component="div">
                    {/* {poc.title} */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{border:'1px solid grey', p:1}}>
                    {/* {poc.description} */}
                  </Typography>
                  
                  <Link href={poc.link} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </Link>
                </CardContent>
            </Card>
          
          {/* ))} */}

          </CardContent>
      </Card>

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
