import React from 'react';
import { Bar } from 'react-chartjs-2';

//redux
import { useSelector } from 'react-redux';

//mui
import { Typography, Box } from '@mui/material'; 

export default function MessagesPerUsers() {
    const userMessageCount = useSelector((state) => state.textData.freshData.user_message_counts);
    const lables = userMessageCount.names; 
    const gradientColors = generateGradientColors(userMessageCount.values.length, 'rgba(76, 206, 172, 1)');

    const data = {
        labels: lables,
        datasets: [
            {
            label: 'Message Count',
            data: userMessageCount.values,
            backgroundColor: gradientColors,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            },
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
        <Box>
          <Typography variant="h6">Messages per Users:</Typography>
          <Bar data={data} options={options} />
        </Box>
      );
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
}