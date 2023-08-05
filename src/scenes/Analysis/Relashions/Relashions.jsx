import React, { useContext } from 'react';
import RawData from './Comp/RawData';
import RelationGraph from './Comp/RelationGraph';

//redux
import { useSelector } from 'react-redux';

//mui
import { Box, Typography, useTheme } from '@mui/material';
//theme
import { ColorModeContext, tokens } from "../../../theme";

export default function Relashions() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const data = useSelector((state) => state.textData.freshData);

    const RenderedComp = () => {
      return (
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: colors.grey[100]}}>Here are the highest chat relashionships:</Typography>
          <RawData />
          <RelationGraph />
        </Box>
      )
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '100vh', overflowX: 'hidden', padding: '30px' }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: colors.grey[100]}}>Relashions Statistics</Typography>
        {data !== undefined && Object.keys(data).length !== 0 ? <RenderedComp /> : <div>Upload file to start</div>}
    </Box>
  )
}
