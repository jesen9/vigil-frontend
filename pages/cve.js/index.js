
import * as React from "react";
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
  Button,
  Paper,
  Divider,
  Modal,
  Autocomplete,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import InputWrapper from "../../components/InputWrapper";

const FilterCVE = () => {

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <Grid container justifyContent={"space-between"}>
                <Grid container item xs={4}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
                        Filter CVE
                    </Typography>

                  
                    <Grid container spacing={2}>
                    <Grid container item flex={12}>
                    {/* <Paper> */}
                    <InputWrapper>
                        <Typography sx={{ p: 1, fontWeight: 600 }}>CVE ID</Typography>
                    </InputWrapper>
                    <InputWrapper>
                        <TextField
    
                        sx={{ backgroundColor: "white", mr: 0.5 }}
                        size="small"
                        variant="outlined"
                        fullWidth
                        />

                    </InputWrapper>
                   {/* </Paper> */}

                    </Grid>
                    </Grid>
                 
                </Grid>
            </Grid>
        </Box>

    )
}

export default FilterCVE;