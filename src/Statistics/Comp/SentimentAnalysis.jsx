import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//redux
import { useSelector } from 'react-redux';

//mui
import { Typography, Box } from '@mui/material'; 

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentAnalysis() {
    const sentiment = useSelector((state) => state.textData.freshData.sentiment);

    const gradientColors = generateGradientColors(2, 'rgba(76, 206, 172, 1)');

    const data = {
        labels: [ 'Positive', 'Negative' ],
        datasets: [
        {
            label: 'Sentiment Analysis',
            data: [sentiment.positive_words, sentiment.negative_words],
            backgroundColor: gradientColors,
        },
        ],
    };

    const options = {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: true, // Disable aspect ratio
        plugins: {
        legend: {
            // position: 'bottom',
            display: false
            
        },
        },
    };

  return (
    <Box width={{ width: '50%'}}>
          {/* <Typography variant="h6">Sentiment Analysis</Typography> */}
          <Pie data={data} options={options} />
        </Box>
  )
}

const generateGradientColors = (count, baseColor) => {
    const colors = [];
    const alphaStep = 1 / count;
  
    for (let i = 0; i < count; i++) {
        const alpha = alphaStep * (i + 1);
        const color = `rgba(76, 206, 172, ${alpha})`;
        colors.push(color);
    }
  
    return colors;
};