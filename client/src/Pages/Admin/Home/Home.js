import React, { useState, useEffect } from "react";
import axios from "axios";
import HomepageCarousel from "../../../Components/HomePageCarousel";
import NavigationBar from "../NavigationBar/NavigationBar";

import cardBg1 from "../../../Images/1.png";
import cardBg2 from "../../../Images/4.png";
import cardBg3 from "../../../Images/4.png";
import cardBg4 from "../../../Images/1.png";

const Home = ({ images }) => {
  const [counts, setCounts] = useState({
    totalClients: 0,
    newClients: 0,
    paymentsPending: 0,
    totalReminders: 0,
    blockedClients: 0,
    supportTickets: 0,
    totalEmployees: 0,
  });

  useEffect(() => {
    async function fetchClientsCounts() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/Home/api/clients-counts",
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

  const handlePaymentsPendingClick = async () => {
    console.log("hi")
    try {
      const token = localStorage.getItem("token");

      // Make an HTTP GET request to fetch pending payments data
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/Home/api/pending-payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ handlePaymentsPendingClick ~ response:", response)
      const responseData = response.data;

    // Check if responseData is an array
    if (Array.isArray(responseData)) {
      let formattedData = "<table style='border-collapse: collapse; width: 100%;'>";
      formattedData += "<tr>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Invoice ID</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Amount</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Due Date</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Is Paid</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>User Name</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Email</th>";
      formattedData += "<th style='padding: 8px; border: 1px solid black; background-color: #f2f2f2;'>Phone Number</th>";
      formattedData += "</tr>";
    
      for (const payment of responseData) {
        const user = payment.user;
        formattedData += "<tr>";
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${payment.invoiceId}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${payment.amount}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${new Date(payment.duedate).toLocaleDateString()}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${payment.ispaid}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${user ? `${user.firstname} ${user.lastname}` : 'N/A'}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${user ? user.email : 'N/A'}</td>`;
        formattedData += `<td style='padding: 8px; border: 1px solid black;'>${user ? user.Phone_number : 'N/A'}</td>`;
        formattedData += "</tr>";
      }
    
      formattedData += "</table>";
    
      const newWindow = window.open();
      newWindow.document.write(formattedData);
    }
     else {
      console.error("Unexpected response format:", responseData);
    }
  }    
     catch (error) {
      // Handle errors
      console.error("Error fetching pending payments:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <NavigationBar />
      <>
        <div className="flex flex-wrap h-screen">
          <div className="w-full p-4">
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
            background-image: url(${cardBg2});
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
            <HomepageCarousel className="mt-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card1">
                <h2 className="text-xl font-semibold">Total No of Clients</h2>
                <p className="text-3xl font-bold">{counts.totalClients}</p>
              </div>
              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card1">
                <h2 className="text-xl font-semibold">New Clients</h2>
                <p className="text-3xl font-bold">{counts.newClients}</p>
              </div>
              <div
                className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card1 cursor-pointer"
                onClick={handlePaymentsPendingClick}
              >
                <h2 className="text-xl font-semibold">Payments Pending</h2>
                <p className="text-3xl font-bold">{counts.paymentsPending}</p>
              </div>

              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card1">
                <h2 className="text-xl font-semibold">Total Reminders</h2>
                <p className="text-3xl font-bold">{counts.totalReminders}</p>
              </div>
              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card3">
                <h2 className="text-xl font-semibold">Blocked Clients</h2>
                <p className="text-3xl font-bold">{counts.blockedClients}</p>
              </div>
              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card2">
                <h2 className="text-xl font-semibold">Support Tickets</h2>
                <p className="text-3xl font-bold">{counts.supportTickets}</p>
              </div>
              <div className="bg-white border rounded-lg shadow-md p-4 mb-4 main-card card3">
                <h2 className="text-xl font-semibold">Total Employees</h2>
                <p className="text-3xl font-bold">{counts.totalEmployees}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Home;
