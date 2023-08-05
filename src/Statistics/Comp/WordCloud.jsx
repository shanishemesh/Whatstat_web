import React, { useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';

//redux
import { useSelector } from 'react-redux';

//mui
import { Box, Typography } from '@mui/material';

export default function WordCloud() {
  const words = useSelector((state) => state.textData.freshData.word_count);

  useEffect(() => {
    // Sort the words based on frequency in descending order
    const sortedWords = words.sort((a, b) => b.value - a.value);

    // Take the top 20 words
    const top20Words = sortedWords.slice(0, 20);

    console.log("Sorted Words:", sortedWords);
    console.log("Top 20 Words:", top20Words);
  }, [words]);

  return (
    <Box>
      <Typography variant="h5">Top {words.length} words used:</Typography>
      <ReactWordcloud words={words} size={[400, 400]} scale={1} options={{ fontSizes: [40, 70] }} />
    </Box>
  );
}
