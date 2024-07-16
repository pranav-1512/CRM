import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import NavigationBar from "../NavigationBar/NavigationBar";

const SupportTickets = () => {
  let navigate = useNavigate();

  const [supportTickets, setSupportTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC] = useState(50);
  const [modalOpen, setModalOpen] = useState(false);
  const [documentToRemove, setDocumentToRemove] = useState("");
  const [deleteticket, setdeleteticket] = useState(null);

  const [tickets, setTickets] = useState(supportTickets);

  useEffect(() => {
    let isMounted = true;
    const fetchSupportTickets = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/supportticket/getMyTickets",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response) {
          throw new Error("Failed to fetch profile data");
        }
        setSupportTickets(
          response.data.tickets.map((ticket) => ({
            ...ticket,
            showDetails: false,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        if (isMounted && error.response && error.response.status === 500) {
          alert("Session expired. Please login again.");
          navigate("/");
        }
      }
    };

    fetchSupportTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check if support tickets are still loading
  if (loading) {
    return null; // Show nothing while loading
  }

  const totalPagesC = Math.ceil(supportTickets.length / itemsPerPageC);

  const paginateC = (pageNumber) => {
    setCurrentPageC(pageNumber);
  };

  const renderPaginationButtonsC = () => {
    const buttons = [];
    const maxButtons = 3; // Number of buttons to display
    const maxPages = Math.min(totalPagesC, maxButtons);
    const middleButton = Math.ceil(maxPages / 2);
    let startPage = Math.max(1, currentPageC - middleButton + 1);
    let endPage = Math.min(totalPagesC, startPage + maxPages - 1);

    if (currentPageC > middleButton && totalPagesC > maxButtons) {
      startPage = Math.min(currentPageC - 1, totalPagesC - maxButtons + 1);
      endPage = Math.min(startPage + maxButtons - 1, totalPagesC);
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

    if (totalPagesC > maxButtons && endPage < totalPagesC) {
      buttons.push(
        <li key="ellipsis" className="page-item disabled">
          <span className="page-link bg-blue-500 text-white font-semibold py-2 px-4 rounded">
            ...
          </span>
        </li>
      );
      buttons.push(
        <li key={totalPagesC} className="page-item">
          <button
            onClick={() => paginateC(totalPagesC)}
            className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {totalPagesC}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const toggleDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(!showDetails);
  };

  const handleView = (ticket) => {
    toggleDetails(ticket);
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  const handlePreview = async (fileId, filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/supportticket/previewSupportTicket/${fileId}`,
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

  const handleDownload = async (fileId, filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/supportticket/downloadSupportTicket/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
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

  // const indexOfLastTicket = currentPage * ticketsPerPage;
  // const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  const filteredTickets = supportTickets.filter((ticket) => {
    return (
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issueMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.files &&
        ticket.files.some((file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  // Determine pagination boundaries
  const indexOfFirstTicket = (currentPageC - 1) * itemsPerPageC;
  const indexOfLastTicket = indexOfFirstTicket + itemsPerPageC;

  // Slice filtered tickets for current page
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  // Calculate total number of pages
  // const totalPagesC = Math.ceil(filteredTickets.length / itemsPerPageC);

  // const currentTickets = filteredTickets.slice(
  //   indexOfFirstTicket,
  //   indexOfLastTicket
  // );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteTicket = async (index, ticketId, ticketDescription) => {
    // Open modal to confirm deletion
    console.log(ticketId);
    setdeleteticket(ticketId);
    setDocumentToRemove(ticketDescription);
    setModalOpen(true);
  };

  const handleConfirmRemove = async (confirm) => {
    if (confirm) {
      try {
        const token = localStorage.getItem("token");
        console.log(deleteticket);
        await axios.post(
          "https://sstaxmentors-server.vercel.app/user/deleteSupportTicket",
          { ticketId: deleteticket },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Remove the ticket from the supportTickets state
        setSupportTickets((prevTickets) => {
          const updatedTickets = prevTickets.filter(
            (ticket) => ticket.ticketId !== deleteticket
          );
          return updatedTickets;
        });

        // Close the modal after successful deletion
        setModalOpen(false);
        message.success("Ticket deleted successfully!");
      } catch (error) {
        message.error("Ticket not deleted. Please try again later.");
        console.error("Error deleting support ticket:", error);
      }
    } else {
      // If the user cancels, simply close the modal
      setModalOpen(false);
    }
  };

  if (!supportTickets || supportTickets.length === 0) {
    return <p>No support tickets available.</p>;
  }

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-screen-lg w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-blue-500 mb-2 lg:mb-0 lg:mr-4">
              SUPPORT TICKETS
            </h2>
            {showDetails && selectedTicket ? (
              ""
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-auto"
                />
              </div>
            )}
          </div>
          <hr className="my-2 border-t-2 bg-gradient-to-r from-red-500 to-blue-500 border-solid" />
          {loading ? (
            <p>Loading...</p>
          ) : showDetails && selectedTicket ? (
            <div>
              <div className="mt-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-semibold">Ticket ID:</td>
                      <td>{selectedTicket.ticketId}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Date:</td>
                      <td>
                        {new Date(
                          selectedTicket.timestamp
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Status:</td>
                      <td>{selectedTicket.status}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Description:</td>
                      <td>{selectedTicket.issueMessage}</td>
                    </tr>
                    {selectedTicket.files &&
                      selectedTicket.files.map((file, fileIndex) => (
                        <tr key={fileIndex}>
                          <td className="font-semibold">Filename:</td>
                          <td>{file.filename}</td>
                          <td>
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-md"
                              onClick={() =>
                                handlePreview(file.fileId, file.filename)
                              }
                            >
                              Preview
                            </button>
                          </td>
                          <td>
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md"
                              onClick={() =>
                                handleDownload(file.fileId, file.filename)
                              }
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
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
              {currentTickets.map((ticket, index) => (
                <div key={index} className="mb-4 pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Ticket ID:</span>{" "}
                      {ticket.ticketId}
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(ticket.timestamp).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      {ticket.status}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Description:</span>{" "}
                    {ticket.issueMessage.length > 50 && !ticket.showDetails
                      ? ticket.issueMessage.slice(0, 50) + "..."
                      : ticket.issueMessage}
                    {ticket.issueMessage.length > 50 && (
                      <button
                        className="text-blue-500"
                        onClick={() => toggleDetails(ticket)}
                      >
                        {ticket.showDetails ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                  {ticket.showDetails && (
                    <div>
                      <span className="font-semibold">Full Description:</span>{" "}
                      {ticket.issueMessage}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="font-semibold">Files:</span>{" "}
                    {ticket.files.map((file) => (
                      <div
                        key={file.fileId}
                        className="flex items-center space-x-2"
                      >
                        <span>{file.filename}</span>
                        {file.filename &&
                          file.filename.slice(-3).toLowerCase() === "pdf" && (
                            <button
                              className="text-blue-500"
                              onClick={() =>
                                handlePreview(file.fileId, file.filename)
                              }
                            >
                              Preview
                            </button>
                          )}
                        <button
                          className="text-green-500"
                          onClick={() =>
                            handleDownload(file.fileId, file.filename)
                          }
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={() =>
                        handleDeleteTicket(
                          index,
                          ticket.ticketId,
                          ticket.issueMessage
                        )
                      }
                    >
                      Delete Ticket
                    </button>
                  </div>
                </div>
              ))}
              <nav className="flex justify-center mt-4">
                <ul className="pagination flex justify-center items-center my-4">
                  <li
                    className={`page-item ${
                      currentPageC === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginateC(currentPageC - 1)}
                      className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                  </li>
                  {renderPaginationButtonsC()}
                  <li
                    className={`page-item ${
                      currentPageC === totalPagesC ? "disabled" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginateC(currentPageC + 1)}
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
        {modalOpen && (
          <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-1/3 mx-auto p-6 rounded shadow-lg z-20">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-bold">Confirm Removal</p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <svg
                      className="fill-current h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-700">
                  Are you sure you want to remove the document:{" "}
                  {documentToRemove}?
                </p>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => handleConfirmRemove(true)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirmRemove(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
