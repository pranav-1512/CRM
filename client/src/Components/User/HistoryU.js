import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  let navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  let isMounted = true;

  useEffect(() => {
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchHistory = async () => {
    isMounted = true;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sstaxmentors-server.vercel.app/user/historyu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setHistory(response.data);
    } catch (error) {
      if (isMounted && error.response && error.response.status === 500) {
        // setShowAlert(true);
        // setAlertShown(true); // Set flag to true once alert is shown
        alert("Session expired. Please login again.");
        navigate("/");
      }
      console.error("Error fetching history:", error);
    }
  };

  const filteredHistory = history
    .filter((item) => {
      const formattedSearchQuery = searchQuery.toLowerCase().trim();
      const itemValues = [
        item.activity,
        item.filename,
        item.employeeName,
        item.clientName,
        item.description,
      ].map((value) => (value ? value.toLowerCase() : "")); // Convert all values to lowercase

      if (userFilter === "admin") {
        // Only consider employee name for admin filter
        return (
          itemValues[2].includes("admin") &&
          (formattedSearchQuery === "" ||
            itemValues.some((value) => value.includes(formattedSearchQuery)))
        );
      } else {
        // Consider all fields for other filters
        return (
          itemValues.some((value) => value.includes(formattedSearchQuery)) &&
          (userFilter === "all" ||
            item.employeeRole === userFilter.toLowerCase())
        );
      }
    })
    .filter((item) => {
      // Date-wise filter
      return (
        (!startDateFilter ||
          new Date(item.dateTime) >= new Date(startDateFilter)) &&
        (!endDateFilter || new Date(item.dateTime) <= new Date(endDateFilter))
      );
    });

  const sortedHistory = filteredHistory.sort((a, b) => {
    const dateA = new Date(a.dateTime);
    const dateB = new Date(b.dateTime);
    return dateB - dateA;
  });

  return (
    <div className="container mx-auto p-10">
      <div className="flex flex-wrap mt-4">
        <div className="w-full">
          <div className="border border-gray-200 rounded p-5 flex items-center">
            {/* Date filter inputs */}
            <div className="flex items-center mr-4">
              <label className="text-gray-500 font-semibold mr-2">
                Select Start Date:
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
            </div>
            <div className="flex items-center">
              <label className="text-gray-500 font-semibold mr-2">
                Select End Date:
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
            </div>
            {/* Search input */}
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>
        {/* Display history */}
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S No</th>
              <th className="py-2 px-4 border-b">Activity</th>
              <th className="py-2 px-4 border-b">Filename</th>
              <th className="py-2 px-4 border-b">Employee Name</th>
              <th className="py-2 px-4 border-b">Client Name</th>
              <th className="py-2 px-4 border-b">Operation</th>
              <th className="py-2 px-4 border-b">Date Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((item, index) => (
              <tr
                key={index}
                className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item.activity}</td>
                <td className="py-2 px-4 border-b">{item.filename}</td>
                <td className="py-2 px-4 border-b">{item.employeeName}</td>
                <td className="py-2 px-4 border-b">{item.clientName}</td>
                <td className="py-2 px-4 border-b">{item.operation}</td>
                <td className="py-2 px-4 border-b">{item.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
