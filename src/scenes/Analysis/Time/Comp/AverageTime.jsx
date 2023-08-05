import React, { useEffect } from 'react';

//redux
import { useSelector } from 'react-redux';

//mui
import { List, ListItem, ListItemText } from '@mui/material'; 

export default function AverageTime() {
    const timeStat = useSelector((state) => state.textData.freshData.time[1]);
    const userTimeStat = useSelector((state) => state.textData.freshData.time[2].users);
    const weekday = useSelector((state) => state.textData.freshData.time[5]);

    // useEffect(() => {
    //     console.log(timeStat);
    // },[timeStat])
  return (
    <List>
        <ListItem>
            <ListItemText sx={{ color: '#6bc2ac'}}>
                Based on {timeStat.timeStat.day_time} days
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                The average start time of the conversation is:  {timeStat.timeStat.first_message_time} 
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                The average end time of the conversation is:  {timeStat.timeStat.last_message_time}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                Usually the first to start the conversation is:  {userTimeStat.first_message_sender} and the last to send is {userTimeStat.last_message_sender}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemText>
                The week day with the most messages is:  {weekday.most_active_day} with {weekday.most_active_count}
            </ListItemText>
        </ListItem>
    </List>
  )
}