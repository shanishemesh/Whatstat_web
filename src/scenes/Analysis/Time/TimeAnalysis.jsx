import React, { useContext } from 'react';
import AverageTime from './Comp/AverageTime';
import DayFrequency from './Comp/DateFrequency';
import WeekdaysFrequency from './Comp/WeekdayFrqquency';

//redux
import { useSelector } from 'react-redux';
//mui
import { Box, Typography, useTheme } from '@mui/material';
//theme
import { ColorModeContext, tokens } from "../../../theme";

export default function TimeAnalysis() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const data = useSelector((state) => state.textData.freshData);
  
  const RenderedComp = () => {
    return (
      <Box>
        <AverageTime />
        <DayFrequency />
        <WeekdaysFrequency />
      </Box>
    )
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '100vh', overflowY: 'scroll', padding: '30px' }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: colors.grey[100]}}>Time Statistics</Typography>
        {data !== undefined && Object.keys(data).length !== 0 ? <RenderedComp /> : <div>Upload file to start</div>}
    </Box>
  )
};