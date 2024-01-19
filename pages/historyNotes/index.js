// LAYAR LIST PROCESS TYPE
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
  Autocomplete,
  Stack,
  FAB,
  Alert,
  Chip,
  AlertTitle,
  CircularProgress,
  Pagination,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/router";
import useToast from "../../utils/toast";
import { setStorage, getStorage, deleteStorage } from "../../utils/storage";
import AddIcon from "@mui/icons-material/Add";
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SaveIcon from "@mui/icons-material/Save";
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


const ProcessType = () => {
  const router = useRouter();
  const userID = getStorage("user_id");
  // const accessList = getStorage("access_list");
  const [displayToast] = useToast();
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  /////////////////////////// PROCESS TYPE ///////////////////////////
  const [listProcessType, setListProcessType] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [paramsProcessType, setParamsProcessType] = useState({
    page: 0,
    limit: 10,
  });
  const [totalDataProcessType, setTotalDataProcessType] = useState(0);

  const debounceMountListProcessType = useCallback(
    debounce(mountListProcessType, 400),
    []
  );

  async function mountListProcessType(keyword, paramsProcessType) {
    try {
      const getAllProcessType = await processType.getAllProcessType(
        keyword,
        paramsProcessType
      );
      const { data } = getAllProcessType;
      if (data.error.status === false) {
        setListProcessType(data.data);
        setTotalDataProcessType(data.count);
        displayToast("success", "Berhasil Mengambil List Process Type");
      } else {
        displayToast("error", "Gagal Mengambil List Process Type");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (event, newPage) => {
    if (paramsProcessType.page === newPage) {
      return;
    }
    const newParamsProcessType = {
      ...paramsProcessType,
      page: newPage,
      limit: paramsProcessType.limit,
    };
    setParamsProcessType(newParamsProcessType);
    debounceMountListProcessType(keyword, newParamsProcessType);
  };

  const handleRowsPerPageChange = async (event, newRows) => {
    if (paramsProcessType.limit === newRows) {
      return;
    }
    const newParamsProcessType = {
      ...paramsProcessType,
      page: 0,
      limit: event.target.value,
    };
    setParamsProcessType(newParamsProcessType);
    debounceMountListProcessType(keyword, newParamsProcessType);
  };

  /////////////////////////// SEARCH PROCESS TYPE ///////////////////////////
  const [inputSearchProcessType, setInputSearchProcessType] = useState("");

  const debounceMountSearchProcessType = useCallback(
    debounce(mountSearchProcessType, 400),
    []
  );

  async function mountSearchProcessType(keyword) {
    setParamsProcessType({
      page: 0,
      limit: 10,
    });
    try {
      const searchProcessType = await processType.getAllProcessType(
        keyword,
        paramsProcessType
      );
      const { data } = searchProcessType;
      if (data.error.status === false) {
        setParamsProcessType({
          page: 0,
          limit: 10,
        });
        setListProcessType(data.data);
        setTotalDataProcessType(data.count);
        displayToast("success", "Berhasil Mengambil Process Type");
      } else {
        setListProcessType([]);
        displayToast("error", "Gagal Mengambil Process Type");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDownSearch = (event, keyword) => {
    if (event.key === "Enter") {
      debounceMountSearchProcessType(keyword);
    }
  };


  // ON BEGINING //
  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListProcessType(keyword, paramsProcessType);
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
                value={inputSearchProcessType}
                onChange={(e) => setInputSearchProcessType(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDownSearch(e, inputSearchProcessType)
                }
              />
            </ModalInputWrapper>

            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              onClick={() =>
                debounceMountSearchProcessType(inputSearchProcessType)
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
              {listProcessType &&
                listProcessType.map((processTypeItem, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {processTypeItem.process_type_id}
                    </TableCell>
                    <TableCell align="center">
                      {processTypeItem.process_type_name}
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
                                  size="small"
                                  variant="contained"
                                >
                                  <EditIcon />
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                
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
                              onClick={() => handleButtonEdit(processTypeItem)}
                              size="small"
                              variant="contained"
                              color="primary"
                            >
                              <EditIcon />
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
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  count={totalDataProcessType}
                  rowsPerPage={paramsProcessType.limit}
                  page={paramsProcessType.page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
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

      {/* ------------------------------------ MODAL LOADING ------------------------------------ */}

      <Modal open={isModalLoading} onClose={() => setIsModalLoading(false)}>
        <ModalWrapper>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: 750,
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" size={50} thickness={4} />
          </Box>
        </ModalWrapper>
      </Modal>
    </Box>
  );
};
export default ProcessType;
