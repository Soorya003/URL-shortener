import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyResponse = await axios.get('http://localhost:3000/api/urls/analytics?period=daily');
        const monthlyResponse = await axios.get('http://localhost:3000/api/urls/analytics?period=monthly');

        // Generate chart data based on response
        const dailyLabels = dailyResponse.data.map(url => url.shortUrl);
        const dailyCounts = dailyResponse.data.map(url => url.clicks);

        setChartData({
          labels: dailyLabels,
          datasets: [
            {
              label: 'Daily URL Clicks',
              data: dailyCounts,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        });

        setUrls(monthlyResponse.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Line data={chartData} />
      <h2>Monthly URLs</h2>
      <ul>
        {urls.map((url) => (
          <li key={url._id}>{url.originalUrl} - {url.shortUrl} - {url.clicks} clicks</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
