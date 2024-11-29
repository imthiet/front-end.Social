import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import './Manage_progress.css';
import SideBar from "../Manage_web";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các scale và component cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Manage_Progress = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Ban đầu không có nhãn
    datasets: [
      {
        label: "Number of Posts",
        data: [], // Ban đầu không có dữ liệu
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/post/all_p", {
        withCredentials: true, // Đảm bảo gửi thông tin xác thực
      })
      .then((response) => {
        const data = response.data;

        // Chuyển đổi Object thành Arrays
        const labels = Object.keys(data); // ["JANUARY", "OCTOBER", ...]
        const values = Object.values(data); // [2, 2, ...]

        // Cập nhật chartData
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Posts",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Đảm bảo hủy bỏ biểu đồ cũ trước khi tạo biểu đồ mới
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.destroy(); // Hủy bỏ biểu đồ cũ
    }
  }, [chartData]); // Chạy lại khi dữ liệu chartData thay đổi

  return (
    <div>
       <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="post-chart">
      {chartData && chartData.labels.length > 0 ? (
        <Bar
          ref={chartRef} // Tham chiếu đến chart để có thể hủy bỏ khi cần
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Post Statistics by Month",
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
      </div>
    </div>
  );
};

export default Manage_Progress;
