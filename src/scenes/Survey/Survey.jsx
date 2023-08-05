import React, { useContext } from 'react';
import Form from './Form';

// mui
import { Box, Typography } from '@mui/material';

export default function Survey() {
   
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '100vh', overflowX: 'hidden', padding: '30px' }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold"}}>Survey</Typography>
        <Typography sx={{ fontSize: "16px", fontWeight: "400", color: '#6bc2ac'}}>Please fill the this survey</Typography>
        <Form />
    </Box>
  )
}
