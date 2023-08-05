import React, { useEffect, useState } from 'react';
//redux
import { useSelector } from 'react-redux';

//mui
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  StyledTableCell,
  TableCell,
  TableBody,
  Button,
  useTheme,
} from '@mui/material';

export default function SentimentAnalysisData() {
  const sentiment = useSelector((state) => state.textData.freshData.sentiment);
  const posSenMess = useSelector((state) => state.textData.freshData.sentiment.positive_sentences);
  const posSenMessScore = useSelector((state) => state.textData.freshData.sentiment.positive_sentences_score);
  const negSenMess = useSelector((state) => state.textData.freshData.sentiment.negative_sentences);
  const ngeSenMessScore = useSelector((state) => state.textData.freshData.sentiment.negative_sentences_score);

  useEffect(() => {
    console.log(negSenMess.length, posSenMess.length);
  }, []);

  
  const initialRowsToShow = 40;
  const [positiveRowsToShow, setPositiveRowsToShow] = useState(initialRowsToShow);
  const [negativeRowsToShow, setNegativeRowsToShow] = useState(initialRowsToShow);

  const PositiveTable = () => {
    const data = [];
    for (let i = 0; i < posSenMess.length; i++) {
      data.push({
        message: posSenMess[i],
        score: posSenMessScore[i],
      });
    }

    // Sort the data by the score in descending order
    data.sort((a, b) => b.score - a.score);

    // If the table is not expanded, show only initialRowsToShow rows
    const rowCount = positiveRowsToShow === initialRowsToShow ? Math.min(data.length, initialRowsToShow) : data.length;

    const TableCreate = () => {
      // const length = posSenMess.length > negSenMess.length ? posSenMess.length : negSenMess.length; add this if you want to display all messages in the table, but change the for loop accordingly!
      const rows = [];
          for (let i = 0; i < 21; i++) {
              rows.push( // Add the row to the rows array
                  <TableRow key={i} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'lightgrey' } }}> {/* Make sure to include a unique key for each row */}
                      <TableCell>{posSenMess[i]}</TableCell>
                      <TableCell>{posSenMessScore[i]}</TableCell>
                      <TableCell>{negSenMess[i]}</TableCell>
                      <TableCell>{ngeSenMessScore[i]}</TableCell>
                  </TableRow>
              );
          }
  
      return rows; // Return the array of rows
      
    };

    return (
      <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table stickyHeader aria-label="positive-sentiment-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Positive messages</TableCell>
              <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, rowCount).map((item, index) => (
              <TableRow key={index + 1}>
                <TableCell>{item.message}</TableCell>
                <TableCell>{item.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const NegativeTable = () => {
    const data = [];
    for (let i = 0; i < negSenMess.length; i++) {
      data.push({
        message: negSenMess[i],
        score: ngeSenMessScore[i],
      });
    }

    // Sort the data by the score in descending order
    data.sort((a, b) => b.score - a.score);

    // If the table is not expanded, show only initialRowsToShow rows
    const rowCount = negativeRowsToShow === initialRowsToShow ? Math.min(data.length, initialRowsToShow) : data.length;

  

    return (
      <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table stickyHeader aria-label="negative-sentiment-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Negative messages</TableCell>
              <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, rowCount).map((item, index) => (
              <TableRow key={index + 1}>
                <TableCell>{item.message}</TableCell>
                <TableCell>{item.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Get the theme
  const theme = useTheme();

  // Function to get button text color based on the theme mode (light/dark)
  const getButtonTextColor = () => {
    return theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black;
  };

  return (
    <Box mt={2}>
      <Typography style={{ fontSize: 16, color: '#6bc2ac' }}>Sentiment Analysis Data</Typography>
      <List>
        {/* ... (existing list items) ... */}
      </List>
      <Box>
      <List>
            <ListItem>
                <ListItemText>Total positive messages - {sentiment.total_positive_messages}</ListItemText>
                <ListItemText>Total positive score {sentiment.total_positive_score}</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Total negative messages - {sentiment.total_negative_messages}</ListItemText>
                <ListItemText>Total negative score {sentiment.total_negative_score}</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Calculated positive user - {sentiment.most_positive_user}</ListItemText>
                <ListItemText>Total positive score {sentiment.most_positive_user_score}</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Calculated negative user - {sentiment.most_negative_user}</ListItemText>
                <ListItemText>Total negative score {sentiment.most_negative_user_score}</ListItemText>
            </ListItem>
      </List>

      </Box>
      <Box mt={2}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5">Positive Sentiment</Typography>
          <span role="img" aria-label="Positive Sentiment Emoji" style={{ marginRight: '20px' }}>
            😃
          </span>
        </Box>
        <PositiveTable />
        {posSenMess.length > initialRowsToShow && (
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setPositiveRowsToShow((prev) => Math.max(prev - initialRowsToShow, 0))}
              style={{ color: getButtonTextColor() }} // Set the button text color dynamically
            >
              &lt; Previous
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setPositiveRowsToShow((prev) => Math.min(prev + initialRowsToShow, posSenMess.length))
              }
              style={{ color: getButtonTextColor() }} // Set the button text color dynamically
            >
              Next &gt;
            </Button>
          </Box>
        )}
      </Box>
      <Box mt={2}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5">Negative Sentiment</Typography>
          <span role="img" aria-label="Negative Sentiment Emoji" style={{ marginRight: '20px' }}>
            🙁
          </span>
        </Box>
        <NegativeTable />
        {negSenMess.length > initialRowsToShow && (
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setNegativeRowsToShow((prev) => Math.max(prev - initialRowsToShow, 0))}
              style={{ color: getButtonTextColor() }} // Set the button text color dynamically
            >
              &lt; Previous
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setNegativeRowsToShow((prev) => Math.min(prev + initialRowsToShow, negSenMess.length))
              }
              style={{ color: getButtonTextColor() }} // Set the button text color dynamically
            >
              Next &gt;
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}


