import React, { useContext, useState } from 'react';

//redux
import { useSelector } from 'react-redux';
//mui
import { Box, Typography, useTheme, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
//theme
import { ColorModeContext, tokens } from "../../../../theme";
import { styled } from '@mui/material/styles';


export default function RawData() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const interactionsData = useSelector((state) => state.textData.freshData.interactions);
  const usersData = useSelector((state) => state.textData.freshData.user_names);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the total number of pages based on interactionsData length and rowsPerPage
  const totalPages = Math.ceil(interactionsData.length / rowsPerPage);

  const TableData = () => {
    // Create a copy of interactionsData array
    const copyData = [...interactionsData];

    // Sort the copyData in descending order based on interactionsCount
    const sortedData = copyData.sort((a, b) => b.interactionsCount - a.interactionsCount);

    // Calculate the starting index for the current page
    const startIndex = currentPage * rowsPerPage;

    // Take the elements for the current page
    const currentPageData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    const rows = [];


    for (let i = 0; i < currentPageData.length; i++) {
      rows.push(
        <TableRow key={i + 21}>
          <TableCell>{currentPageData[i].sender}</TableCell>
          <TableCell>{currentPageData[i].recipient}</TableCell>
          <TableCell>{currentPageData[i].interactionsCount}</TableCell>
        </TableRow>
      );
    }

    return rows;
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Create custom styles for the buttons
  const PrevButton = styled(Button)({
    color: 'white', // Set the text color to white
    borderColor: 'white', // Set the border color to white
  });

  const NextButton = styled(Button)({
    color: 'white', // Set the text color to white
    borderColor: 'white', // Set the border color to white
  });

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Sender</TableCell>
            <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Recipient</TableCell>
            <TableCell sx={{ color: '#6bc2ac', fontWeight: 'bold', fontSize: '15px' }}>Interaction count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableData />
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="center">
        <PrevButton variant="outlined" onClick={handlePrevPage} disabled={currentPage === 0}>
          &lt; Previous
        </PrevButton>
        <NextButton variant="outlined" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
          Next &gt;
        </NextButton>
      </Box>
    </Box>
  );
}




