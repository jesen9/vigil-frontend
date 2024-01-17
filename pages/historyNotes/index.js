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
} from "@mui/material";
import { useRouter } from "next/router";
import useToast from "../../utils/toast";
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

  /////////////////////////// GET PROCESS TYPE BY ID ///////////////////////////
  const debounceMountProcessTypeById = useCallback(
    debounce(mountProcessTypeById, 400),
    []
  );
  const [processTypeById, setProcessTypeById] = useState("");

  async function mountProcessTypeById(id) {
    try {
      const getProcessTypeById = await processType.getProcessTypeById(id);
      const { data } = getProcessTypeById.data;
      setProcessTypeById(data[0]);
    } catch (error) {
      displayToast("error", "Failed to Fetch Data");
      console.log(error);
    }
  }

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
