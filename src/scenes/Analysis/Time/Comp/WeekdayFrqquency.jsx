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

export default function WeekdaysFrequency() {
  const days = useSelector((state) => state.textData.freshData.time[3]);
  const count = useSelector((state) => state.textData.freshData.time[4]);

  const labels = days;
  const gradientColorsMedia = generateGradientColors(days.length, '76, 206, 172');

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Days Frequency',
        data: count,
        backgroundColor: gradientColorsMedia,
      }
    ],
  };

  const maxFrequencyIndex = count.indexOf(Math.max(...count));
  const dayWithHighestFrequency = days[maxFrequencyIndex];

  const options = {
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Days', // X-axis title
          font: {
            size: 16,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency of Messages', // Y-axis title
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

  return (
    <Box>
      <Typography variant="h5">Number of messages per Day:</Typography>
      <Bar data={data} options={options} />
      <Typography variant="body1" mt={2} style={{ fontSize: 16 }}>
        The group is active on the day:  {dayWithHighestFrequency}
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