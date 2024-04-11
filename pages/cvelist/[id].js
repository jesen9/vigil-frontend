import * as React from "react";
import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Tooltip,
  Typography,
  TableBody,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Link,
  IconButton, 
  Modal,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControlLabel,
  Checkbox,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { debounce } from "lodash";
import { useRouter } from 'next/router';
import useToast from "../../utils/toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from '@mui/icons-material/Reply';
import api from "../../services/api"
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import { setStorage, getStorage, deleteStorage } from "../../utils/storage";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { green, yellow, red, grey } from '@mui/material/colors';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));



function CVEDetails () {
  const router = useRouter();
  const [displayToast] = useToast();
  const [notes, setNotes] = useState('');
  const userID = getStorage("user_id");
  const [isModalLoading, setIsModalLoading] = useState(false);
  const cveId = router.query.id
  const uniqueCWEIds = new Set();
  const [cveDetails, setCveDetails] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [selectedReports, setSelectedReports] = useState([]);
  const [pocID, setPOCID] = useState('');
  const [pocTitle, setPOCTitle] = useState('');
  const [otherReport, setOtherReport] = useState('');
  const [openDialog, setOpenDialog] = React.useState(false);

  console.log("notes value", notes);
const handleTooltipOpen = () => {
  setOpen(true);
};

const handleTooltipClose = () => {
  setOpen(false);
};
   
const handleOpenDialog = () => {
  setOpenDialog(true);;
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

const handleFeedbackOpen = (pocID, pocTitle) => {
  setPOCID(pocID);
  setPOCTitle(pocTitle);
  setFeedbackOpen(true);
};

const handleFeedbackClose = () => {
  setFeedbackOpen(false);
};


  const debounceMountCVEDetails = useCallback(
    debounce(mountCVEDetails, 400),
    []
  );

  const debounceMountNotes = useCallback(
    debounce(mountNotes, 400),
    []
  );

  async function mountCVEDetails(cveId) {
    try {
      setIsModalLoading(true);
      const getcveDetails = await api.getCVEDetails(cveId);
      const { data } = getcveDetails;
      console.log('ini datanya ya', data)
      setCveDetails(data);
      // setCPE(data.cpe)
      // setPOC(data.poc)
      setIsModalLoading(false);
    } catch (error) {
      setIsModalLoading(false);
      displayToast("error", "Failed to Fetch CVE Details Data");
      console.log(error);
    }
  }

  async function mountNotes(cveId) {
    try {
      console.log('cveId: ', cveId);
      const getNotes = await api.getNotebyCVE(cveId);
      const { data } = getNotes;
      console.log('dataNotes', data);
      setNotes(data);
      // displayToast("error", "");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log("halo gais")
    if (!router.isReady) return;
    debounceMountCVEDetails(router.query.id);
    if(userID){
      debounceMountNotes(router.query.id);
    }
  }, [router.isReady]);


  const getBackgroundColor = (severity) => {
    switch (severity) {
      case 'LOW':
        return green[500];
      case 'MEDIUM':
        return yellow[500];
      case 'HIGH':
        return red[500];
      case 'CRITICAL':
        return red[900]; // Adjust to your preferred shade of grey for critical severity
      default:
        return 'white'; // Default background color
    }
  };

  const handleSendFeedback = () => {
    // Create a copy of selectedReports
    const updatedSelectedReports = [...selectedReports];
    
    // Add otherReport to updatedSelectedReports if it's not empty
    if (otherReport.trim() !== '') {
      updatedSelectedReports.push(otherReport.trim());
    }
    
    const feedback = {
      pocid : pocID,
      userID : userID,
      feebackMsg : comments,
      reportMsg: updatedSelectedReports,
    }
    // Handle sending feedback data
    console.log('Comments:', comments);
    console.log('Selected Reports:', updatedSelectedReports);

    displayToast("success", "Your Feedback has been saved!");
    // displayToast("error", "Error saved feedback!");
    
    // Close the dialog
    handleCloseDialog();
    handleFeedbackClose();
  };

  const handleToggleReport = (report) => {
    if (selectedReports.includes(report)) {
      setSelectedReports(selectedReports.filter(item => item !== report));
    } else {
      setSelectedReports([...selectedReports, report]);
    }
  };

  const reportOptions = [
    { label: "The Proof of Concept (PoC) doesn't work", value: 'pocNotWorking' },
    { label: "The site appears to be a scam", value: 'scamSite' },
    { label: "The link provided is broken", value: 'brokenLink' },
    { label: "The Proof of Concept (PoC) is outdated", value: 'outdatedPoC' },
    // Add more report options as needed
  ];
  

  return (
    <Box sx={{ width: "100%", p: 3 }}>
       <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <IconButton aria-label="back" onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            CVE Details
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      {/* {Array.isArray(cveDetails) && cveDetails.map((cvedetail, index) => ( */}
  <Grid  container component={Paper} sx={{   p: 2, marginBottom: 3 ,}} justifyContent={'space-between'} rowSpacing={1} elevation={7}>
    <Grid item sx={{width: "100%"}}>
      <Typography variant="h4" sx={{ fontWeight: 500, mt: 0.5, color:"#8EB4F4"  }}>
        {cveDetails.cveid}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 400, mt: 0.5 }}>
        {cveDetails.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
    </Grid>
    <Grid item xs={6}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 0.5 }}>
        Published At: {cveDetails.publishedat}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 0.5 }}>
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
             <Typography variant="h6" sx={{ fontWeight: 600}}>
               CVSS Score
             </Typography>
          
           </Grid>
         </Grid>
           <Paper  sx={{overflow: 'auto', maxHeight: '400px'}}>
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
                Base Severity
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Base Score
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Exploitability Score
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "600" }}>
                Impact Score
              </TableCell>
            </TableHead>
              <TableBody>
              {cveDetails && cveDetails.cvssscore && cveDetails.cvssscore.map((cvss, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {cvss.version}
                    </TableCell>
                    <TableCell align="center">
                    <LightTooltip
                      title={
                        cvss.version === '3' || cvss.version === '3.1' ? (
                          <div>
                            <p>Attack Vector: {cvss.attackVector}</p>
                            <p>Attack Complexity: {cvss.attackComplexity}</p>
                            <p>Privileges Required: {cvss.privilegesRequired}</p>
                            <p>User Interaction: {cvss.userInteraction}</p>
                            <p>Scope: {cvss.scope}</p>
                            <p>Confidentiality Impact: {cvss.confidentialityImpact}</p>
                            <p>Integrity Impact: {cvss.integrityImpact}</p>
                            <p>Availability Impact: {cvss.availabilityImpact}</p>
                          </div>
                        ) : (
                          <div>
                            <p>Access Vector: {cvss.accessVector}</p>
                            <p>Access Complexity: {cvss.accessComplexity}</p>
                            <p>Authentication: {cvss.authentication}</p>
                            <p>Confidentiality Impact: {cvss.confidentialityImpact}</p>
                            <p>Integrity Impact: {cvss.integrityImpact}</p>
                            <p>Availability Impact: {cvss.availabilityImpact}</p>
                          </div>
                        )
                      }
                      placement="bottom"
                      arrow
                    >
                      <Button onClick={handleTooltipOpen}>{cvss.vectorString}</Button>
                    </LightTooltip>
                      
                    </TableCell>
                   
                    <TableCell align="center"   >
                      <Typography variant="subtitle3"
                      sx={{ 
                        fontWeight: 500,
                        borderRadius:1,
                        backgroundColor: getBackgroundColor(cvss.baseSeverity),
                        border: `1px solid ${getBackgroundColor(cvss.baseSeverity)}`,
                        padding: 1
                      }}
                      >
                      {cvss.baseSeverity}
                      </Typography>
                      
                    </TableCell>
                    <TableCell align="center">
                      {cvss.baseScore}
                    </TableCell>
                    <TableCell align="center">
                      {cvss.exploitabilityScore}
                    </TableCell>
                    <TableCell align="center">
                      {cvss.impactScore}
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
           <Grid container item xs={6} alignItems="center"  >
             <Typography variant="h6" sx={{ fontWeight: 600 }}>
               Weakness Enumeration (CWE) IDs
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 400, mt: 0.5 }}>
                        {cwe.cweid} - {cwe.name}
                      </Typography>
                        <Divider/>
                      <Typography variant="body2" color="text.secondary" sx={{ p:1, mb:1}}>
                        {cwe.description}
                      </Typography>
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
      <CardContent>
      <Grid container
            justifyContent={"space-between"}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ my: 1 }}
       >
           <Grid container item xs={6} alignItems="center"  >
             <Typography variant="h6" sx={{ fontWeight: 600}}>
               Vendor and Product Affected (CPE)
             </Typography>
          
           </Grid>
         </Grid>
           <Paper sx={{overflow: 'auto', maxHeight: '400px'}}>
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
              {cveDetails &&
                cveDetails.cpe &&
                cveDetails.cpe.map((cpe, index) => {
                  // Split the cpe.criteria string using colon (:) as a delimiter
                  const [CPE, cpeVersion, part, vendor, product, version] = cpe.criteria.split(':');

                  return (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <LightTooltip
                          title={
                            <div>
                              <p>Vendor: {vendor.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</p>
                              <p>Product: {product.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</p>
                              <p>Version: {version}</p>
                              {/* Add more fields if needed */}
                            </div>
                          }
                          placement="bottom"
                          arrow
                        >
                          <Button onClick={handleTooltipOpen} style={{ textTransform: 'none' }}>{cpe.criteria} </Button>
                        </LightTooltip>
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
                  );
                })}
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
             <Typography variant="h6" sx={{ fontWeight: 600}}>
               Proof of Concept
             </Typography>
          
           </Grid>
          </Grid>

          
          {cveDetails && cveDetails.poc && cveDetails.poc.map((poc, index) => (
            <Card key={index} sx={{ borderRadius: 3, mb: 3 }}>
             
                <CardContent sx={{ overflow: "auto", position:'relative' }}>
                <Tooltip title={userID? "Give feedback" : "Share Your Thoughts! Log in to Give Feedback"}>
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={userID ? () => handleFeedbackOpen(poc.id, poc.title) : undefined} // Define handleFeedback function
                  >
                    <FeedbackIcon />
                  </IconButton>
                </Tooltip>
                  <Typography variant="subtitle1" component="div" sx={{mb:1, fontWeight:'500'}}>
                    {poc.title} 
                  </Typography>
                  <Divider/>
                  <Typography variant="body2" color="text.secondary" sx={{ p:1, mb:1}}>
                    {poc.description}
                  </Typography>
                  <Link href={poc.link} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </Link>
                </CardContent>
            </Card>
          
          ))} 

          </CardContent>
      </Card>

      <Dialog open={feedbackOpen} onClose={handleFeedbackClose}>
        <DialogTitle>Provide Feedback for This {pocTitle} </DialogTitle>
        <DialogContent>
          <TextField
            label="Additional Comments"
            multiline
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle1">Report:</Typography>
          {reportOptions.map(option => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox 
                  checked={selectedReports.includes(option.value)} 
                  onChange={() => handleToggleReport(option.value)} 
                />
              }
              label={option.label}
            />
          ))}
          {/* Add more report options similarly */}
          <TextField
            label="Other (please specify)"
            fullWidth
            margin="normal"
            onChange={(e) => setOtherReport(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeedbackClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleOpenDialog} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: "#dd2c00" }} align="center">
            {<ErrorOutlineRoundedIcon sx={{ fontSize: 60 }} />}
          </DialogTitle>
          <DialogContent>
          <DialogContentText
            sx={{ color: "text.secondary", pb: 1.2 }}
            align="center"
          >
             You are about to add this Feedback:
          </DialogContentText>

          <DialogContentText sx={{ color: "text.secondary" }} align="center">
            {pocTitle} 
          </DialogContentText>

          <DialogContentText
            sx={{ color: "text.secondary", pt: 1.2 }}
            align="center"
          >
            Are you sure?
          </DialogContentText>
          </DialogContent>
          <DialogContent align="center">

          <Button
            sx={{ mx: 1 }}
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCloseDialog}
          >
            No
          </Button>

          <Button
            sx={{ mx: 1 }}
            variant="contained"
            color="primary"
            size="small"
            // onClick={() => debounceMountInsertNotes(cveID, notesContent)}
            onClick={() => handleSendFeedback()}
          >
            Yes
          </Button>
        </DialogContent>

        </Dialog> 

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
         
        
      {notes ? (
        <ScrollToTopButton value={ notes } />
      ):(
        <ScrollToTopButton value={{ cve_id: router.query.id, notes: notes }} />
      )
      }   

    </Box>
  );
}

export default CVEDetails;
