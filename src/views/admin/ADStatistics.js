import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const ADStatistics = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Thay thế việc gọi API bằng dữ liệu mẫu
    const mockData = [
      { week: 'Tuần 1', orders: 20, revenue: 60 },
      { week: 'Tuần 2', orders: 30, revenue: 40 },
      { week: 'Tuần 3', orders: 30, revenue: 70 },
      { week: 'Tuần 4', orders: 15, revenue: 50 },
    ];

    setWeeklyData(mockData);
    prepareChartData(mockData);
  }, []);

  const prepareChartData = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      const labels = data.map(item => item.week || 'No Week');
      const orders = data.map(item => item.orders || 0);
      const revenue = data.map(item => item.revenue || 0);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Số Đơn',
            data: orders,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Doanh Thu',
            data: revenue,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
            fill: false,
            tension: 0.4
          }
        ]
      });
    } else {
      setChartData({ labels: [], datasets: [] });
      console.error('Dữ liệu không hợp lệ hoặc mảng rỗng.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 2,marginTop:'30px',marginLeft:'30px' }}>
        <h2>Thống Kê Theo Tuần</h2>
        <div>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y;
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                x: {
                  beginAtZero: true
                },
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: '20px', marginTop:'20px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop:'86px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Tuần</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Số Đơn</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.week || 'No Week'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.orders || 0}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.revenue || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ADStatistics;
