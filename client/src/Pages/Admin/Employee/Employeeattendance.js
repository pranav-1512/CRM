
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const Employeeattendance = () => {
  const [atten, setAtten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function convertToIST(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/employee/employeeatten",
        {
          params: {
            searchQuery: searchQuery,
            startDate: startDate,
            endDate: endDate
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAtten(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Atten state:", atten);
  }, [atten]);

  const totalPages = Math.ceil(atten.length / itemsPerPage);

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
            className={`page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${currentPage === i ? "current-page" : ""
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

  const filteredAttendance = atten.filter((attendance) => {
    const attendanceDate = new Date(attendance.timestamp);
    return (
      (!searchQuery || attendance.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!startDate || attendanceDate >= new Date(startDate)) &&
      (!endDate || attendanceDate <= new Date(endDate))
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAttendance.length);
  const slicedAttendance = filteredAttendance.slice(startIndex, endIndex);

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="container mx-auto p-4">
        <p className="font-bold text-3xl m-5 text-blue-500 mb-10">
          Employee Attendance{" "}
        </p>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 p-2 mr-2"
          />
      <div className="flex flex-col md:flex-row justify-end items-end">
          <div className="flex items-center mb-2 md:mb-0">
            <label className="mr-2 font-semibold">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-400 p-2"
            />
          </div>
          <div className="flex items-center md:ml-4">
            <label className="mr-2 font-semibold">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-400 p-2"
            />
          </div>
        </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">SNo</th>
                <th className="py-2 px-4 border-b">Employee Email</th>
                <th className="py-2 px-4 border-b">Activity</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {slicedAttendance.map((attendance, index) => (
                <tr
                  key={attendance._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 px-4 border-b">
                    {filteredAttendance.length - startIndex - index}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {attendance.email ? attendance.email : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{attendance.activity}</td>
                  <td className="py-2 px-4 border-b">
                    {`${attendance.latitude}, ${attendance.longitude}`}
                  </td>
                  <td className="py-2 px-4 border-b">{convertToIST(attendance.timestamp)}</td>
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
              className={`page-item ${currentPage === totalPages ? "disabled" : ""
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

}
export default Employeeattendance;

