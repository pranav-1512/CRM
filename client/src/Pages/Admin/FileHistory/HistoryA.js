import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/history/api/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
      ].map((value) => (value ? value.toLowerCase() : ""));

      if (userFilter === "admin") {
        return (
          itemValues[2].includes("admin") &&
          (formattedSearchQuery === "" ||
            itemValues.some((value) => value.includes(formattedSearchQuery)))
        );
      } else if (userFilter === "employee") {
        return (
          itemValues[2].includes("employee") &&
          (formattedSearchQuery === "" ||
            itemValues.some((value) => value.includes(formattedSearchQuery)))
        );
      } else if (userFilter === "client") {
        return (
          itemValues[2].includes("client") &&
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

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3; // Number of buttons to display
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

    if (totalPages > maxButtons && endPage < totalPages) {
      buttons.push(
        <li key="ellipsis" className="page-item disabled">
          <span className="page-link bg-blue-500 text-white font-semibold py-2 px-4 rounded">
            ...
          </span>
        </li>
      );
      buttons.push(
        <li key={totalPages} className="page-item">
          <button
            onClick={() => paginate(totalPages)}
            className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);
  const slicedHistory = filteredHistory.slice(startIndex, endIndex);

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="container mx-auto p-10">
        <p className="font-bold text-3xl  text-blue-500 mb-10">HISTORY </p>
        <div className="flex flex-wrap mt-4">
          <div className="mb-4 w-full">
            <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
              <div className="flex justify-between">
                <div
                  className={`cursor-pointer ${
                    userFilter === "all"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center`}
                  onClick={() => setUserFilter("all")}
                >
                  <span
                    className={`mr-2 ${
                      userFilter === "all" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    All
                  </span>
                </div>
                <div className="mx-6"></div> {/* Add some space */}
                <div
                  className={`cursor-pointer ${
                    userFilter === "admin"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center`}
                  onClick={() => setUserFilter("admin")}
                >
                  <span
                    className={`mr-2 ${
                      userFilter === "admin" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    Admin
                  </span>
                </div>
                <div className="mx-6"></div> {/* Add some space */}
                <div
                  className={`cursor-pointer ${
                    userFilter === "employee"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center`}
                  onClick={() => setUserFilter("employee")}
                >
                  <span
                    className={`mr-2 ${
                      userFilter === "employee"
                        ? "border-b-2 border-blue-500"
                        : ""
                    }`}
                  >
                    Employee
                  </span>
                </div>
                <div className="mx-6"></div> {/* Add some space */}
                <div
                  className={`cursor-pointer ${
                    userFilter === "client"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center`}
                  onClick={() => setUserFilter("client")}
                >
                  <span
                    className={`mr-2 ${
                      userFilter === "client"
                        ? "border-b-2 border-blue-500"
                        : ""
                    }`}
                  >
                    Client
                  </span>
                </div>
              </div>

              <div className="flex items-center mr-4">
                <label className="text-gray-500 font-semibold mr-2">
                  Select Date:
                </label>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mr-2"
                />
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mr-2"
                />
              </div>
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 mr-2"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mt-4">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S&nbsp;No</th>
                <th className="py-2 px-4 border-b">Activity</th>
                <th className="py-2 px-4 border-b">Filename</th>
                <th className="py-2 px-4 border-b">Employee&nbsp;Id</th>
                <th className="py-2 px-4 border-b">Client&nbsp;Name</th>
                <th className="py-2 px-4 border-b">Operation</th>
                <th className="py-2 px-4 border-b">Date&nbsp;Time</th>
              </tr>
            </thead>
            <tbody>
              {slicedHistory.map((item, index) => (
                <tr
                  key={index}
                  className={(index + 1) % 2 === 0 ? "bg-gray-100 text-center" : " text-center"}
                >
                  <td className="py-2 px-4 border-b">
                    {filteredHistory.length - startIndex - index}
                  </td>
                  <td className="py-2 px-4 border-b">{item.activity}</td>
                  <td className="py-2 px-4 border-b">{item.filename}</td>
                  <td className="py-2 px-4 border-b">{item.employeeId}</td>
                  <td className="py-2 px-4 border-b">{item.clientName}</td>
                  <td className="py-2 px-4 border-b">{item.operation}</td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(item.dateTime)}
                  </td>
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
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
