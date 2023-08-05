import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

//redux
import { useSelector } from 'react-redux';

//mui
import { Typography, Box } from '@mui/material'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MediaNVoicePerUser() {
  const userMediaData = useSelector((state) => state.textData.freshData.media_sent);
  const userVoiceData = useSelector((state) => state.textData.freshData.voice_messages_sent);

  const labels = userMediaData.user;
  const gradientColorsMedia = generateGradientColors(userMediaData.count.length, '76, 206, 172');
  const gradientColorsVoice = generateGradientColors(userVoiceData.count.length, '53, 162, 235');

  const data = {
    labels: labels,
    datasets: [
        {
          label: 'Media Count',
          data: userMediaData.count,
          backgroundColor: gradientColorsMedia,
        },
        {
          label: 'Voice Count',
          data: userVoiceData.count,
          backgroundColor: gradientColorsVoice,
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
        display: true, // Set the display property to true to show the legend
        position: 'bottom', // You can change the position of the legend if needed
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  

  return (
    <Box width={{ width: '90%'}}>
      <Typography variant="h6">Media and Voice messages per Users:</Typography>
      <Bar data={data} options={options} />
    </Box>
  )
};

const generateGradientColors = (count, baseColor) => {
  const colors = [];
  const alphaStep = 1 / count;

  for (let i = 0; i < count; i++) {
      const alpha = alphaStep * (i + 1);
      const color = `rgba(${baseColor}, ${alpha})`;
      colors.push(color);
  }

  return colors;
};