import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiViewBoard } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";



const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};


const Notifications = () => {
  let navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(100);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      setLoading(true); // Set loading to true when starting API call
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/notification/getnotifications",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response) {
          throw new Error("Failed to fetch profile data");
        }
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (isMounted && error.response && error.response.status === 500) {
          // If the response status is 401, display an alert and redirect to login page
          alert("Session expired. Please login again.");
          // window.location.href = '/'; // Change the URL accordingly
          navigate("/");
        }
        setLoading(false); // Make sure to set loading to false on error
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  // const totalPages = Math.ceil(notifications.length / itemsPerPageC);

  const paginateC = (pageNumber) => {
    setCurrentPageC(pageNumber);
  };

  const renderPaginationButtonsC = () => {
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
  const endIndexC = Math.min(startIndexC + itemsPerPageC, notifications.length);
  const slicedHistoryC = notifications.slice(startIndexC, endIndexC);

  const toggleDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetails(!showDetails);
  };

  const handleView = (index) => {
    const notificationData = index;

    // Store data in local storage
    localStorage.setItem("notification", JSON.stringify(notificationData));

    // Open new tab
    const notificationWindow = window.open("/notification", "_blank");

    if (!notificationWindow) {
      alert(
        "Please allow pop-ups for this website to view notification details."
      );
    }
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/notification/previewnotification",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            filename: filename,
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
        "https://sstaxmentors-server.vercel.app/user/notification/download",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            filename: filename,
          },
          responseType: "blob", // Set response type to blob
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

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  const filteredNotifications = notifications.filter((notification) => {
    return (
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (notification.files &&
        notification.files.some((file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  const totalPages = Math.ceil(
    filteredNotifications?.length / notificationsPerPage
  );

  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <NavigationBar />

      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-screen-lg w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row justify-between mb-4 w-full">
            <h2 className="text-3xl font-bold text-blue-500 mb-4">
              NOTIFICATIONS LIST
            </h2>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="border border-gray-300 rounded-md px-4 py-2 mr-2"
              />
            </div>
          </div>
          <hr className="my-2 border-t-2 bg-gradient-to-r from-red-500 to-blue-500 border-solid" />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {showDetails ? (
                <div>
                  <div className="mt-4">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-semibold">Title:</td>
                          <td>{selectedNotification.title}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Description:</td>
                          <td>{selectedNotification.description}</td>
                        </tr>
                        {selectedNotification.files &&
                        selectedNotification.files.length > 0 ? (
                          selectedNotification.files.map((file, fileIndex) => (
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
                  {currentNotifications.map((notification, index) => (
                    <div
                      key={index}
                      className="mt-4 mb-4 pb-4 border-b"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="overflow-auto break-words">
                        <h3 className="text-2xl font-medium mb-2 text-black-600">
                          {notification.title}
                        </h3>
                        <p className="text-sm  text-gray-700 mb-2">
                        
                          {truncate(notification.description, 60)}

                        </p>
                      </div>
                      <button
                        className="text-3xl"
                        onClick={() => handleView(notification)}
                      >
                        <CiViewList />
                      </button>
                    </div>
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
                      {renderPaginationButtonsC()}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
