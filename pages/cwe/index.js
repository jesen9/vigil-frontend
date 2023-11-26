import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Pagination,
  ButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const IndexPage = ({ onSelectLetter }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [selectedLetter, setSelectedLetter] = useState(null);

  const handleSelectLetter = (letter) => {
    // Update the selected letter
    setSelectedLetter(letter);
    // Handle the selected letter (e.g., filter data based on the letter)
    onSelectLetter(letter);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Grid container justifyContent="space-between">
        <Grid item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            CWE FILTERING
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container sx={{ paddingBottom: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            variant="outlined"
            fullWidth
            placeholder="Search by Id / Nama"
            sx={{ backgroundColor: 'white' }}
          />
          <Button variant="contained" size="large" startIcon={<SearchIcon />}>
            SEARCH
          </Button>
        </Stack>
      </Grid>

      <Grid container justifyContent="space-between">
        <Grid item xs={4}>
          <ButtonGroup>
            {alphabet.split('').map((letter) => (
              <Button
                key={letter}
                onClick={() => handleSelectLetter(letter)}
                variant={selectedLetter === letter ? 'contained' : 'outlined'}
              >
                {letter}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>

      {/* Add your content based on the selected letter */}
    </Box>
  );
};

export default IndexPage;
