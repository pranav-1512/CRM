import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
};

const Reminder = () => {
  let navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remindersPerPage,setRemindersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(20);

  useEffect(() => {
    let isMounted = true;
    const fetchReminders = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/reminder/getreminders",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response) {
          throw new Error("Failed to fetch profile data");
        }
        setReminders(response.data.reminders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        if (isMounted && error.response && error.response.status === 500) {
          alert("Session expired. Please login again.");
          navigate("/");
        }
      }
    };

    fetchReminders();
    return () => {
      isMounted = false;
    };
  }, []);

  // const totalPages = Math.ceil(reminders.length / itemsPerPageC);

  const paginateC = (pageNumber) => {
    setCurrentPageC(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3; // Number of buttons to display
    const maxPages = Math.min(totalPages, maxButtons);
    const middleButton = Math.ceil(maxPages / 2);
    let startPage = Math.max(1, currentPageC - middleButton + 1);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (currentPageC > middleButton && totalPages > maxButtons) {
      startPage = Math.min(currentPageC - 1, totalPages - maxButtons + 1);
      endPage = Math.min(startPage + maxButtons - 1, totalPages);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${currentPageC === i ? "active" : ""}`}
        >
          <button
            onClick={() => paginateC(i)}
            className={`page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
              currentPageC === i ? "current-page" : ""
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
            onClick={() => paginateC(totalPages)}
            className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(startIndexC + itemsPerPageC, reminders.length);
  const slicedHistoryC = reminders.slice(startIndexC, endIndexC);

  const toggleDetails = (reminder) => {
    setSelectedReminder(reminder);
    setShowDetails(!showDetails);
  };

  const handleView = (index) => {
    const reminderData = index;
    localStorage.setItem("reminder", JSON.stringify(reminderData));
    const reminderWindow = window.open("/reminder", "_blank");
    if (!reminderWindow) {
      alert("Please allow pop-ups for this website to view reminder details.");
    }
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/reminder/previewreminder/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/reminder/downloadreminder/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  const filteredReminders = reminders.filter((reminder) => {
    return (
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reminder.files &&
        reminder.files.some((file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;

  const currentReminders = filteredReminders.slice(
    indexOfFirstReminder,
    indexOfLastReminder
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredReminders.length / remindersPerPage);

  // Check if reminders are still loading
  if (loading) {
    return null;
  }

  // Check if there are no reminders available
  if (filteredReminders.length === 0) {
    return <p>No reminders available.</p>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-screen-lg w-full bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <p>Loading...</p>
          ) : showDetails ? (
            <div>
              <div className="mt-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-semibold">Title:</td>
                      <td>{selectedReminder.title}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Description:</td>
                      <td>{selectedReminder.description}</td>
                    </tr>
                    {selectedReminder.files &&
                    selectedReminder.files.length > 0 ? (
                      selectedReminder.files.map((file, fileIndex) => (
                        <tr key={fileIndex}>
                          <td className="font-semibold">Filename:</td>
                          <td>{file.filename}</td>
                          <td>
                            {file.filename.slice(-3).toLowerCase() ===
                              "pdf" && (
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handlePreview(file.filename)}
                              >
                                Preview
                              </button>
                            )}
                          </td>
                          <td>
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md"
                              onClick={() => handleDownload(file.filename)}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No files available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-4 w-full">
                <h2 className="text-3xl font-semibold text-blue-500 mb-2 lg:mb-0 lg:mr-4">
                  REMINDERS LIST
                </h2>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-auto"
                  />
                </div>
              </div>

              <hr className="my-2 border-t-2 bg-gradient-to-r from-red-500 to-blue-500 border-solid" />
              {currentReminders.map((reminder, index) => (
                <article
                  key={index}
                  className="mb-4 pb-4 border-b flex justify-between"
                >
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800">
                      {reminder.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2 overflow-auto break-words">
                     
                      {truncate(reminder.description, 60)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col">
                    <button
                      className="bg-blue-500 hover:bg-white text-white hover:text-black px-4 py-2 rounded-md inline-flex"
                      onClick={() => handleView(reminder)}
                    >
                      View
                    </button>
                  </div>
                </article>
              ))}
              <nav className="flex justify-center mt-4">
                <ul className="pagination flex justify-center items-center my-4">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
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
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminder;
