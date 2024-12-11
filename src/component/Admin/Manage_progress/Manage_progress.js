import React, { useEffect, useState, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";
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
  LineElement,
  PointElement,
} from "chart.js";

// Register necessary scales and components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Manage_Progress = () => {
  const [postData, setPostData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Posts",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [interactionData, setInteractionData] = useState({
    labels: [],
    datasets: [
      {
        label: "Like Count",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Comment Count",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [addressData, setAddressData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Count by Address",
        data: [],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [messageData, setMessageData] = useState({
    labels: [],
    datasets: [
      {
        label: "Message Count",
        data: [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  });

  const chartRef = useRef(null);

  // Fetch the data for posts, interactions, addresses, and messages
  useEffect(() => {
    // Fetch Post Data
    axios
      .get("http://localhost:8080/post/all_p", { withCredentials: true })
      .then((response) => {
        const data = response.data;
        const labels = Object.keys(data);
        const values = Object.values(data);
        setPostData({
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
      .catch((error) => console.error("Error fetching post data:", error));

    // Fetch Interaction Data
    axios
      .get("http://localhost:8080/api/statistics/interaction", { withCredentials: true })
      .then((response) => {
        const data = response.data.data;
        if (Array.isArray(data)) {
          const labels = data.map((item) => `${item.month}-${item.year}`);
          const likeCounts = data.map((item) => item.like_count);
          const commentCounts = data.map((item) => item.comment_count);
          setInteractionData({
            labels: labels,
            datasets: [
              {
                label: "Like Count",
                data: likeCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "Comment Count",
                data: commentCounts,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("Interaction data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching interaction data:", error));

    // Fetch Address Data
    axios
      .get("http://localhost:8080/api/statistics/users-by-address", { withCredentials: true })
      .then((response) => {
        const data = response.data.data;
        if (Array.isArray(data)) {
          const labels = data.map((item) => item.address || "Unknown");
          const userCounts = data.map((item) => item.user_count);
          setAddressData({
            labels: labels,
            datasets: [
              {
                label: "User Count by Address",
                data: userCounts,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("Address data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching address data:", error));

    // Fetch Message Data
    axios
      .get("http://localhost:8080/api/statistics/messages", { withCredentials: true })
      .then((response) => {
        const data = response.data.data;
        if (Array.isArray(data)) {
          const labels = data.map((item) => `${item.month}-${item.year}`);
          const messageCounts = data.map((item) => item.message_count);
          setMessageData({
            labels: labels,
            datasets: [
              {
                label: "Message Count",
                data: messageCounts,
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error("Message data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching message data:", error));
  }, []);

  return (
    <div>
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="chart">
        {postData && postData.labels.length > 0 ? (
          <Bar
            ref={chartRef}
            data={postData}
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
          <p>Loading Post Data...</p>
        )}
      </div>

      <div className="chart">
        {interactionData && interactionData.labels.length > 0 ? (
          <Bar
            ref={chartRef}
            data={interactionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  font: 15,
                  text: "Interaction Statistics (Likes & Comments)",
                },
              },
            }}
          />
        ) : (
          <p>Loading Interaction Data...</p>
        )}
      </div>

      <div className="chart">
  {addressData && addressData.labels && addressData.labels.length > 0 ? (
    <Bar
      ref={chartRef}
      data={addressData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "User Count by Address",
          },
        },
      }}
    />
  ) : (
    <p>Loading Address Data...</p>
  )}
</div>


      <div className="chart">
  {messageData && messageData.labels.length > 0 ? (
    <Line
      ref={chartRef}
      data={messageData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Message Statistics by Month",
          },
        },
      }}
    />
  ) : (
    <p>Loading Message Data...</p>
  )}
</div>

    </div>
  );
};

export default Manage_Progress;
