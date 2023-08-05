import React, { useContext } from 'react';

//redux
import { useSelector } from 'react-redux';

//mui
import { Box, Typography, List, ListItem, ListItemText, useTheme } from '@mui/material';
//theme
import { ColorModeContext, tokens } from "../../../theme";

export default function DataComp() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const data = useSelector((state) => state.textData.freshData);

  return (
    <List sx={{borderBottom: '3px solid #6bc2ac'}}>
        <ListItem>
            <ListItemText sx={{ color: '#6bc2ac'}}>
               Here are some statistics about your conversion file :
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                Group name: {data.group_name} 
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                Number of user: {data.user_names.length} 
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                Number of messages sent: {data.message_count} 
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                Conversion length in days: {data.time[1].timeStat.day_time} 
            </ListItemText>
        </ListItem>
        
    </List> 
  )
}
