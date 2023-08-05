import React, { useEffect } from 'react';
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

export default function UserTopEmoji() {
  const userEmojiCounts = useSelector((state) => state.textData.freshData.user_emoji_counts);

  const userNames = Object.keys(userEmojiCounts);
  const emojiCounts = Object.values(userEmojiCounts);

  // Transpose the data to group emojis for each user
  const transposedData = emojiCounts[0][0].map((_, index) => {
    const emojiData = emojiCounts.map(([emojis, counts]) => ({
      emoji: emojis[index],
      count: counts[index],
    }));
    return { emojiData };
  });

  const datasets = transposedData.map(({ emojiData }, index) => {
    const data = emojiData.map((dataItem) => dataItem.count);
    const emojis = emojiData.map((dataItem) => dataItem.emoji);

    return {
      label: `Emoji ${index + 1}`,
      data: data,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.6)`,
      borderColor: `rgba(0, 0, 0, 0.6)`,
      borderWidth: 1,
      stack: `user`,
      emojis: emojis, // Pass the array of emojis here
    };
  });

  const data = {
    labels: userNames,
    datasets: datasets,
  };

  const emojiPlugin = {
    id: 'customLegend',
    afterDraw: (chart) => {
      const { ctx, data, scales, width, height } = chart;
      const fontSize = 16;
      ctx.font = ChartJS.helpers.fontString(fontSize, 'normal', ChartJS.defaults.font.family);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        const visible = meta.hidden !== null ? !meta.hidden : meta.visible;

        if (visible) {
          meta.data.forEach((element, index) => {
            const position = element.tooltipPosition();
            const emoji = dataset.emojis[index];
            ctx.fillStyle = dataset.backgroundColor;
            ctx.strokeStyle = dataset.borderColor;
            ctx.lineWidth = dataset.borderWidth;
            ctx.beginPath();
            ctx.rect(element.x, element.y, element.width, element.height);
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.fillText(emoji, position.x, position.y - 5); // Adjust the Y offset as needed
          });
        }
      });
    },
  };

  const options = {
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Users', // X-axis label
        },
      },
      y: {
        stacked: true,
        beginAtZero: true, // Start the y-axis from 0
        title: {
          display: true,
          text: 'Amount of icons', // Y-axis label
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset;
            const dataIndex = context.dataIndex;
            const emojis = Array.isArray(dataset.emojis) ? dataset.emojis[dataIndex] : dataset.emojis;
            const emojiString = emojis ? (Array.isArray(emojis) ? emojis.join('') : emojis) : '';
            const value = dataset.data[dataIndex];
            return `${emojiString}: ${value}`;
          },
        },
      },
      customLegend: emojiPlugin, // Register the custom plugin for rendering emojis
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  return (
    <Box>
      <Typography variant="h5">The most sent emoji per user:</Typography>
      <Bar data={data} options={options} />
    </Box>
  );
};
