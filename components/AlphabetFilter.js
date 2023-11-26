import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const AlphabetFilter = ({ onSelectLetter }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
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
  );
};

export default AlphabetFilter;
