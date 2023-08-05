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
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DayFrequency() {
  const days = useSelector((state) => state.textData.freshData.time[0]);

  const labels = days.dates;
  const gradientColorsMedia = generateGradientColors(days.count.length, '76, 206, 172');

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Days Frequency',
        data: days.count,
        backgroundColor: gradientColorsMedia,
      }
    ],
  };
  const options = {
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Dates', // X-axis label
          font: {
            size: 16,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true, // Start the y-axis from 0
        title: {
          display: true,
          text: 'Frequency of Messages', // Y-axis label
          font: {
            size: 16,
          },
        },
      },
    },
    responsive: true, // Enable responsiveness
    maintainAspectRatio: true, // Disable aspect ratio
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Find the index of the date with the highest frequency
  const maxFrequencyIndex = days.count.indexOf(Math.max(...days.count));
  // Get the date with the highest frequency
  const dateWithHighestFrequency = labels[maxFrequencyIndex];
  
  return (
    <Box>
      <Typography variant="h5">Number of messages per Date:</Typography>
      <Bar data={data} options={options} />
      <Typography variant="body1" mt={3} style={{ fontSize: 16 }}>
        The group is active on the date: {dateWithHighestFrequency}
      </Typography>
    </Box>
  );
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
