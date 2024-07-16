import React, { useState, useEffect } from "react";
import axios from "axios";
import HomepageCarousel from "../../../Components/HomePageCarousel";
import cardBg1 from "../../../Images/4.png";
import cardBg2 from "../../../Images/4.png";
import cardBg3 from "../../../Images/4.png";
import cardBg4 from "../../../Images/1.png";
import NavigationBar from "../NavigationBar/NavigationBar";

function HomePage() {
  const [counts, setCounts] = useState({
    totalReminders: 0,
    totalNotifications: 0,
    supportTicketsClosed: 0,
    supportTicketsResolved: 0,
    supportTicketsOpen: 0,
  });

  useEffect(() => {
    async function fetchClientsCounts() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/employee/home/clients-counts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching clients counts:", error);
      }
    }
    fetchClientsCounts();
  }, []);

  return (
    <div>
      <NavigationBar/>
    <div className="flex flex-wrap h-screen bg-gray-100">
      <style>
        {`
          .main-card {
            color: #fff;
            padding: 40px;
            background-size: cover;
            background-position: center;
          }
          
          .main-card h2 {
            margin-bottom: 20px;
            font-size: 24px;
          }
          
          .main-card p {
            font-size: 36px;
          }

          .card1 {
            background-image: url(${cardBg1});
            
          }

          .card2 {
            background-image: url(${cardBg1});
            color: #0440DE;
          }

          .card3 {
            background-image: url(${cardBg3});
            color: #0440DE;
          }

          .card4 {
            background-image: url(${cardBg4});
            
          }
        `}
      </style>
      <div className="w-full p-4">
        <HomepageCarousel className="mt-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          <div className="bg-white border rounded-lg shadow-md p-3 mb-4 main-card card4">
            <h2 className="text-xl font-semibold">Total Reminders</h2>
            <p className="text-3xl font-bold">{counts.totalReminders}</p>
          </div>
          <div className="bg-white border rounded-lg shadow-md p-3 mb-4 main-card card4">
            <h2 className="text-xl font-semibold">Total Notifications</h2>
            <p className="text-3xl font-bold">{counts.totalNotifications}</p>
          </div>
          <div className="bg-white border rounded-lg shadow-md p-3 mb-4 main-card card2">
            <h2 className="text-xl font-semibold">Support Tickets Closed</h2>
            <p className="text-3xl font-bold">{counts.supportTicketsClosed}</p>
          </div>
          <div className="bg-white border rounded-lg shadow-md p-3 mb-4 main-card card3">
            <h2 className="text-xl font-semibold">Support Tickets Open</h2>
            <p className="text-3xl font-bold">{counts.supportTicketsOpen}</p>
          </div>
          <div className="bg-white border rounded-lg shadow-md p-3 mb-4 main-card card2">
            <h2 className="text-xl font-semibold">Support Tickets Resolved</h2>
            <p className="text-3xl font-bold">
              {counts.supportTicketsResolved}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default HomePage;
