import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Title, Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

//redux
import { useSelector } from 'react-redux';

ChartJS.register(Title, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MessPerUserBar() {
    const userMessageCount = useSelector((state) => state.textData.freshData.user_message_counts);
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const canvasRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        let arr, arr2 = [];
        console.log(userMessageCount);
        userMessageCount.map(name => {
            const key = Object.keys(name);
            const value = Object.values(name);
            arr.push(key);
            arr2.push(value);
        })
        const conArr = arr[0].concat(arr[1]).concat(arr[2]);
        const conArr2 = arr2[0].concat(arr2[1]).concat(arr2[2]);
        setLabels(conArr);
        setValues(conArr2);

    },[]);

    useEffect(() => {
        // Create the initial chart
        createChart();
    
        // Cleanup function to destroy the chart when the component unmounts
        return () => {
          destroyChart();
        };
      }, []);
    
      const createChart = () => {
        // Destroy existing chart
        destroyChart();
    
        // Configuration for the chart
        const chartConfig = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Number of Messages',
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        };
    
        // Create the chart instance
        const newChartInstance = new ChartJS(canvasRef.current, chartConfig);
        setChartInstance(newChartInstance);
      };
    
      const destroyChart = () => {
        if (chartInstance !== null) {
          chartInstance.destroy();
          setChartInstance(null);
        }
      };
    
      const options = {
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
      };
    
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Number of Messages',
            data: values,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
    
      return (
        <div>
          <Bar data={data} options={options} ref={canvasRef} />
        </div>
      );
}