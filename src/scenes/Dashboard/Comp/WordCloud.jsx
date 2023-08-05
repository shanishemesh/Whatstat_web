import React from 'react';
import ReactWordcloud from 'react-wordcloud';

//redux
import { useSelector } from 'react-redux';

//mui
import { Box, Typography } from '@mui/material';

export default function WordCloud() {
  const words = useSelector((state) => state.textData.freshData.word_count);

  // Logging the words array for investigation
  console.log(words);

  return (
    <Box>
      <Typography variant="h6">Top {words.length} words used:</Typography>
      <ReactWordcloud words={words} size={[400, 400]} scale={1} options={{ fontSizes: [40, 70] }} />
    </Box>
  );
}
