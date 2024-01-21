import React, { useCallback, useEffect, useState } from "react";
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
  Card,
  CardContent,
  IconButton,
  Button,
  Paper,
  Divider,
  TableFooter,
  TablePagination,
  Badge,
  Modal,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "../../utils/link";
import useToast from "../../utils/toast";
import api from "../../services/api";
import { setStorage, getStorage, deleteStorage } from "../../utils/storage";
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { debounce, delay, isNull, isUndefined } from "lodash";


const HistoryNotes = () => {
  const router = useRouter();
  const userID = getStorage("user_id");
  // const accessList = getStorage("access_list");
  const [displayToast] = useToast();
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [listNotes, setListNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEditNote, setOpenEditNote] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [inputValueEdit, setInputValueEdit] = useState({
    cveId:"",
    notes:"",
  });

  const handleDelete = (data) => {
    setDeleteData(data);
    setOpenDelete(true);
  };


  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleEditNotes = (data) => {
    console.log(data);
    setInputValueEdit({
      ...inputValueEdit,
      cveId: data.cve_id,
      notes: data.notes,
    });
    setOpenEditNote(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseEditNotes = () => {
    setOpenEditNote(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const debounceMountListNotes = useCallback(
    debounce(mountListNotes, 400),
    []
  );

  const debounceMountDeleteNotes = useCallback(
    debounce(mountDeleteNotes, 400),
    []
  );

  const debounceMountEditNotes = useCallback(
    debounce(mountEditNotes, 400),
    []
  );

  async function mountListNotes(keyword) {
    try {
      setIsModalLoading(true)
      // console.log("esdfs")
      const getAllNotes= await api.getNotes(
        keyword,
      );
      console.log("test",getAllNotes)
      if (getAllNotes.status === 401) {
        localStorage.clear();
        displayToast("info", "Unauthorized, returning to login page");
        router.push("/login"); // Fixed the typo in changeRoute to router.push
      }
      const { data } = getAllNotes;
      // console.log('dataNotes',data)
      setListNotes(data);     
      setTotalNotes(data.length);
      setIsModalLoading(false)
    } catch (error) {
      console.log(error);
      // console.log("error", error.data)
      if (error.status === 401) {
        localStorage.clear();
        displayToast("info", "Unauthorized, returning to login page");
        router.push("/login"); // Fixed the typo in changeRoute to router.push
      }
      setIsModalLoading(false)
    }
  }

  async function mountDeleteNotes(id) {
    try {
      setIsModalLoading(true)
      const deleteNotes= await api.deleteNotes(
        id,
      );
      if (deleteNotes.status === 401) {
        localStorage.clear();
        displayToast("info", "Unauthorized, returning to login page");
        router.push("/login"); // Fixed the typo in changeRoute to router.push
      }
      const { data } = deleteNotes;
      if (data.message ===  "Notes successfully deleted") {
        displayToast("success", data.message);
        handleCloseDelete()
        setIsModalLoading(false)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
  
      } else {
        displayToast("error", data.message);
        setIsModalLoading(false)
        // displayToast("error", "");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mountEditNotes(inputValueEdit) {
    try {
      const editNotes= await api.insertNotes(
        inputValueEdit
      );
      if (editNotes.status === 401) {
        localStorage.clear();
        displayToast("info", "Unauthorized, returning to login page");
        router.push("/login"); // Fixed the typo in changeRoute to router.push
      }
      const { data } = editNotes;
        setIsModalLoading(true)
      if (data.status ==="Insert notes success!") {
        displayToast("success", data.status);
        handleCloseEdit();
        handleCloseEditNotes();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setIsModalLoading(false)
      } else {
        displayToast("error", data.status);
        setIsModalLoading(false)
        // displayToast("error", "");
      } 
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDownSearch = (event, keyword) => {
    if (event.key === "Enter") {
      debounceMountListNotes(keyword);
    }
  };


  // ON BEGINING //
  useEffect(() => {
    if (!router.isReady) return;
    if(userID){
      debounceMountListNotes(keyword);
    }
   
  }, [router.isReady]);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid>
        <Grid container justifyContent={"center"}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            History Notes
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {userID ? (
        <>
      <Grid container justifyContent={"space-between"} sx={{ my: 2 }}>
        <Grid container item xs={4}>
          <Stack direction="row" spacing={2}>
            <ModalInputWrapper>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Search by CVE ID"
                sx={{ backgroundColor: "white" }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDownSearch(e, keyword)
                }
              />
            </ModalInputWrapper>

            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              onClick={() =>
                debounceMountListNotes(keyword)
              }
            >
              SEARCH
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "600" }}>
                  CVE ID
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "600" }}>
                  Notes
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "600" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {listNotes &&
                listNotes.map((notesItem, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                    <Link  href={`/cvelist/${notesItem.cve_id}`} sx={{ textDecoration: "none"  }}>
                    <Typography variant="subtitle2" >{notesItem.cve_id}</Typography>
                    
                    </Link>
                    </TableCell>
                    <TableCell align="center">
                      {notesItem.notes}
                    </TableCell>
                    <TableCell align="center">
                          <Box>
                            <Grid
                              container
                              spacing={1}
                              direction="row"
                              justifyContent="center"
                            >
                              <Grid item>
                                <Button
                                onClick={ () => handleEditNotes(notesItem)}
                                  size="small"
                                  variant="contained"
                                >
                                  <EditIcon />
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  onClick={ () => handleDelete(notesItem)}
                                  size="small"
                                  variant="contained"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[ 10, 25, 50, 100 ]}
                  count={totalNotes}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      </>
        )  : (

          <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "50vh",}}
        >
          <Grid
          item
          xs={3}
          sx={{
            zIndex: "5",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "380px",
              background: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              padding: "10px 0px",
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{mb:3}}>
                Feel free to explore this feature by logging in!
              </Typography>
              
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => router.push(`/login`)}
                >
                  Login
                </Button>
           
            </CardContent>
          </Card>
        </Grid>
        </Grid>
        )}

        {/* /////////////////////////////////////// Edit Notes //////////////////////////////////////////////////////// */}

        <Dialog
        open={openEditNote}
        onClose={handleCloseEditNotes}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleEdit();
          },
        }}
      >
        <DialogTitle>Edit Notes</DialogTitle>
        <DialogContent>
         
          <TextField
            multiline
            
            margin="dense"
            disabled
            label="CVE ID"
            value={inputValueEdit.cveId}
            type="email"
            fullWidth
            variant="outlined"
          />

          <TextField
            multiline
            fullWidth
            variant="outlined"
            label="Notes"
            rows={7}
            defaultValue={inputValueEdit.notes}
            onChange={(e) => setInputValueEdit({ ...inputValueEdit, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditNotes}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>

        
        {/* /////////////////////////////////// Edit dialog /////////////////////////////////////////////////////// */}

        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle sx={{ color: "#dd2c00" }} align="center">
            {<ErrorOutlineRoundedIcon sx={{ fontSize: 60 }} />}
          </DialogTitle>
          <DialogContent>
          <DialogContentText
            sx={{ color: "text.secondary", pb: 1.2 }}
            align="center"
          >
             You are about to edit this Note:
          </DialogContentText>
          <DialogContentText sx={{ color: "text.secondary" }} align="center">
            {inputValueEdit.cveId}
          </DialogContentText>

          <DialogContentText
            sx={{ color: "text.secondary", pt: 1.2 }}
            align="center"
          >
            Are you sure to Edit this notes?
          </DialogContentText>
          </DialogContent>

          <DialogContent align="center">

            <Button
              sx={{ mx: 1 }}
              variant="outlined"
              color="error"
              size="small"
              onClick={handleCloseEdit}
            >
              No
            </Button>

            <Button
              sx={{ mx: 1 }}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => debounceMountEditNotes(inputValueEdit)}
            >
              Yes
            </Button>
          </DialogContent>


        </Dialog>

        {/* /////////////////////////////////// Delete dialog /////////////////////////////////////////////////////// */}

        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle sx={{ color: "#dd2c00" }} align="center">
            {<ErrorOutlineRoundedIcon sx={{ fontSize: 60 }} />}
          </DialogTitle>
          <DialogContent>
          <DialogContentText
            sx={{ color: "text.secondary", pb: 1.2 }}
            align="center"
          >
             You are about to delete this Note:
          </DialogContentText>

          <DialogContentText sx={{ color: "text.secondary" }} align="center">
            {deleteData.cve_id}
          </DialogContentText>

          <DialogContentText
            sx={{ color: "text.secondary", pt: 1.2 }}
            align="center"
          >
            Are you sure to delete this notes?
          </DialogContentText>
          </DialogContent>
          <DialogContent align="center">

          <Button
            sx={{ mx: 1 }}
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCloseDelete}
          >
            No
          </Button>

          <Button
            sx={{ mx: 1 }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => debounceMountDeleteNotes(deleteData.id)}
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
    </Box>
  );
};
export default HistoryNotes;
