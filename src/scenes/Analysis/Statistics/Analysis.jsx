import React, { useContext } from 'react';
import SentimentAnalysisData from './Comp/SentimentAnalysisData';

//redux
import { useSelector } from 'react-redux';
//mui
import { Box, Typography, useTheme } from '@mui/material';
//theme
import { ColorModeContext, tokens } from "../../../theme";

export default function Cloud() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const data = useSelector((state) => state.textData.freshData);
  
  const RenderedComp = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
        <SentimentAnalysisData />
      </Box>
    )
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '100vh', overflowY: 'scroll', padding: '30px' }}>
      <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: colors.grey[100]}}>Text Analyses</Typography>
      {data !== undefined && Object.keys(data).length !== 0 ? <RenderedComp /> : <div>Upload file to start</div>}
    </Box>
  )
};