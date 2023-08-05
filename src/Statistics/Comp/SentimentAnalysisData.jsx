import React from 'react';
//redux
import { useSelector } from 'react-redux';

//mui
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material'; 

export default function SentimentAnalysisData() {
    const sentiment = useSelector((state) => state.textData.freshData.sentiment);
  return (
    <Box>
        <Typography>Sentiment Analysis Data</Typography>
        <List>
            <ListItem>
                <ListItemText>Total positive words: {sentiment.positive_words}</ListItemText>
                <ListItemText>Total positive score: {sentiment.positive_score}</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Total negative words: {sentiment.negative_words}</ListItemText>
                <ListItemText>Total negative score: {sentiment.negative_score}</ListItemText>
            </ListItem>
        </List>
    </Box>
  )
}
