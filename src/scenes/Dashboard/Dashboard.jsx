import React, { useContext, useEffect } from 'react';
//Comps
import DataComp from './Comp/DataComp';
import WordCloud from './Comp/WordCloud';
import MessagesPerUsers from '../../Statistics/Comp/MessagesPerUsers';
import MediaNVoicePerUser from '../../Statistics/Comp/MediaNVoicePerUser';
import TopEmojis from '../../Statistics/Comp/TopEmojis';
import UserTopEmoji from '../../Statistics/Comp/UsersTopEmoji';
//redux
import { useSelector } from 'react-redux';

//mui
import { Box, Typography, List, ListItem, ListItemText, useTheme } from '@mui/material';

//theme
import { ColorModeContext, tokens } from "../../theme";

export default function Dashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const data = useSelector((state) => state.textData.freshData);   

    const RenderedComp = () => {
      return (
        <Box>
          <DataComp />
          <WordCloud />
          <MessagesPerUsers />
          <MediaNVoicePerUser />
          <TopEmojis />
          <UserTopEmoji />
        </Box>
      )
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '100px', maxHeight: '100vh', overflowY: 'scroll', padding: '30px' }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>Dashboard</Typography>
        {data !== undefined && Object.keys(data).length !== 0 ? <RenderedComp /> : <div>Upload file to start</div>}
    </Box>
  )
};