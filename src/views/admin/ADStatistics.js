import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Đăng ký adapter thời gian

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, TimeScale);

const ADStatistics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedMonth, setSelectedMonth] = useState('2024-07'); // Tháng mặc định (YYYY-MM)

  // Chuyển đổi tháng thành khoảng thời gian ngày bắt đầu và ngày kết thúc
  const getStartDateAndEndDate = (month) => {
    const [year, monthNumber] = month.split('-');
    const startDate = new Date(year, monthNumber - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, monthNumber, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const { startDate, endDate } = getStartDateAndEndDate(selectedMonth);
        const response = await fetch(`https://localhost:7078/api/Statistical/GetOrderStatistics?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        // Dữ liệu từ API
        const formattedData = data.map(item => ({
          date: item.ngay,
          orders: item.soDonHang,
          revenue: item.tongDoanhThu
        }));
        setDailyData(formattedData);
        prepareChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDailyData();
  }, [selectedMonth]); // Cập nhật dữ liệu khi selectedMonth thay đổi

  const prepareChartData = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      const labels = data.map(item => item.date);
      const orders = data.map(item => item.orders);
      const revenue = data.map(item => item.revenue);

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 2, marginTop: '30px', marginLeft: '30px' }}>
        <h2>Thống Kê Theo Ngày</h2>

        <div style={{ width: '600px', height: '400px' }}>
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
                    label: function (context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += formatCurrency(context.parsed.y);
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    tooltipFormat: 'dd/MM/yyyy',
                    displayFormats: {
                      day: 'dd/MM'
                    }
                  },
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 30,
                    callback: function (value) {
                      return new Date(value).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                      });
                    }
                  }
                },
                y: {
                  beginAtZero: true,
                  
                }
              }
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: '20px', marginTop: '20px' }}>
        <select className="form-select w-auto" value={selectedMonth} onChange={handleMonthChange}>
          <option value="2024-07">Tháng 7, 2024</option>
          <option value="2024-08">Tháng 8, 2024</option>
          <option value="2024-09">Tháng 9, 2024</option>
          <option value="2024-10">Tháng 10, 2024</option>
          <option value="2024-11">Tháng 11, 2024</option>
          <option value="2024-12">Tháng 12, 2024</option>
        </select>

        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '340px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Số Đơn</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dailyData) && dailyData.length > 0 ? (
              dailyData.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.orders || 0}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatCurrency(item.revenue) || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ padding: '8px', textAlign: 'center' }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ADStatistics;
