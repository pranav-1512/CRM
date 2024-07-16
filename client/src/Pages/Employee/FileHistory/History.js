import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";

const HistoryPage = () => {
  let isMounted;
  let navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const fetchHistory = async () => {
    isMounted = true;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/employee/history/filehistory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      if (isMounted && error.response && error.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  // Filtered and sorted history
  const filteredHistory = history
    .filter((item) => {
      const formattedSearchQuery = searchQuery.toLowerCase().trim();
      const itemValues = [
        item.activity,
        item.filename,
        item.employeeName,
        item.clientName,
        item.description,
      ].map((value) => (value ? value.toLowerCase() : ""));

      if (userFilter === "admin") {
        return (
          itemValues[2].includes("admin") &&
          (formattedSearchQuery === "" ||
            itemValues.some((value) => value.includes(formattedSearchQuery)))
        );
      } else {
        return (
          itemValues.some((value) => value.includes(formattedSearchQuery)) &&
          (userFilter === "all" ||
            item.employeeRole === userFilter.toLowerCase())
        );
      }
    })
    .filter((item) => {
      return (
        (!startDateFilter ||
          new Date(item.dateTime) >= new Date(startDateFilter)) &&
        (!endDateFilter || new Date(item.dateTime) <= new Date(endDateFilter))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return dateB - dateA;
    });

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3;
    const maxPages = Math.min(totalPages, maxButtons);
    const middleButton = Math.ceil(maxPages / 2);
    let startPage = Math.max(1, currentPage - middleButton + 1);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (currentPage > middleButton && totalPages > maxButtons) {
      startPage = Math.min(currentPage - 1, totalPages - maxButtons + 1);
      endPage = Math.min(startPage + maxButtons - 1, totalPages);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button
            onClick={() => paginate(i)}
            className={`page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
              currentPage === i ? "current-page" : ""
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const calculateSno = (index) => {
    return filteredHistory.length - (currentPage - 1) * itemsPerPage - index;
  };

  return (
    <div>
      <NavigationBar/>
      <hr></hr>
    <div className="container mx-auto p-10">
      <p className="font-bold text-3xl text-blue-500 mb-10">
        HISTORY
      </p>
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
        <table className="min-w-full border border-gray-300 mt-4 text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S No</th>
              <th className="py-2 px-4 border-b">Activity</th>
              <th className="py-2 px-4 border-b">Filename</th>
              <th className="py-2 px-4 border-b">Employee Id</th>
              <th className="py-2 px-4 border-b">Client Name</th>
              <th className="py-2 px-4 border-b">Operation</th>
              <th className="py-2 px-4 border-b">Date Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((item, index) => (
                <tr
                  key={index}
                  className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 px-4 border-b">{calculateSno(index)}</td>
                  <td className="py-2 px-4 border-b">{item.activity}</td>
                  <td className="py-2 px-4 border-b">{item.filename}</td>
                  <td className="py-2 px-4 border-b">{item.employeeId}</td>
                  <td className="py-2 px-4 border-b">{item.clientName}</td>
                  <td className="py-2 px-4 border-b">{item.operation}</td>
                  <td className="py-2 px-4 border-b">{formatDate(item.dateTime)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <ul className="pagination flex justify-center items-center my-4">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
              {/* Left icon */}
            </button>
          </li>
          {renderPaginationButtons()}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              onClick={() => paginate(currentPage + 1)}
              className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              <FontAwesomeIcon icon={faAngleRight} />
              {/* Right icon */}
            </button>
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default HistoryPage;
