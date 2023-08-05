import { Box, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import sentiment from "sentiment";
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { tokens } from "../../theme";


const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fileContent, setFileContent] = useState("");
  const [positiveResult, setPositiveResult] = useState(null);
  const [negativeResult, setNegativeResult] = useState(null);

  const analyzeSentiment = (content) => {
    const result = sentiment(content, 'he');
    if (result.score >= 0) {
      setPositiveResult(result);
      setNegativeResult(null);
    } else {
      setPositiveResult(null);
      setNegativeResult(result);
    }
  };

  useEffect(() => {
    if (fileContent) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const sentimentScore = analyzeSentiment(text);
        setFileContent(sentimentScore);
      };
      reader.readAsText(fileContent);
    }
  }, [fileContent]);
  

  return (
    <div >
      <Box display="flex">
        <div style={{ flex: 1 }}>
        <Box display="flex" alignItems="center" style={{ marginLeft: '20px' }}>
          <ThumbUpAltRoundedIcon fontSize="large" />
          <h2 style={{ marginLeft: '10px' }}>positive Text:</h2>
        </Box>
          {positiveResult && (
            <div>
              <p>Text: {fileContent}</p>
              <p>Sentiment Score: {positiveResult.score}</p>
              <p>Sentiment Comparative: {positiveResult.comparative}</p>
              <p>Sentiment Tokens: {JSON.stringify(positiveResult.tokens)}</p>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
        <Box display="flex" alignItems="center">
          <ThumbDownAltRoundedIcon fontSize="large" /> 
          <h2 style={{ marginLeft: '10px' }}>Negative Text:</h2>
        </Box>
          {negativeResult && (
            <div>
              <p>Text: {fileContent}</p>
              <p>Sentiment Score: {negativeResult.score}</p>
              <p>Sentiment Comparative: {negativeResult.comparative}</p>
              <p>Sentiment Tokens: {JSON.stringify(negativeResult.tokens)}</p>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Team;
