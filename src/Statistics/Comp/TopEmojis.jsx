import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//redux
import { useSelector } from 'react-redux';

//mui
import { Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopEmojis() {
  const topEmoji = useSelector((state) => state.textData.freshData.top_emoji);
  const labels = topEmoji.emoji;
  const randomColors = generateRandomColors(topEmoji.values.length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Emoji Count',
        data: topEmoji.values,
        backgroundColor: randomColors,
      },
    ],
  };

  const options = {
    responsive: true, // Enable responsiveness
    maintainAspectRatio: true, // Disable aspect ratio
    plugins: {
      legend: {
        display: true, // Show the legend
        position: 'bottom', // Position the legend at the bottom
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = data.labels[context.dataIndex];
            const value = data.datasets[0].data[context.dataIndex];
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Box width={{ width: '68%' }}>
      <Typography variant="h6">Top emojis used</Typography>
      <Pie data={data} options={options} />
    </Box>
  );
}

const generateRandomColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    colors.push(color);
  }
  return colors;
};
