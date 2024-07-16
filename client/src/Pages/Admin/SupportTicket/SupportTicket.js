import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

const SupportTicket = () => {
  const [clientData, setClientData] = useState([]);
  const [filteredClientData, setFilteredClientData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewingClient, setIsViewingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [SupportTicketData, setSupportTicketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupportTicketIndex, setSelectedSupportTicketIndex] =
    useState(-1);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [filteredSupportTicketData, setFilteredSupportTicketData] = useState(
    []
  );
  const [searchQueryC, setSearchQueryC] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    filterClientData();
  }, [clientData, searchQueryC, filterOption]);

  useEffect(() => {
    if (selectedClient) {
      fetchSupportTicketData(selectedClient);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (SupportTicketData.length > 0) {
      filterSupportTicketData();
    }
  }, [SupportTicketData, searchQueryC, selectedField, filterOption]);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/manageclient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientData(response.data.clients);
    } catch (error) {
      console.error("Error fetching clientData:", error);
    }
  };

  const totalPagesC = Math.ceil(clientData.length / itemsPerPageC);

  const paginateC = (pageNumber) => {
    setCurrentPageC(pageNumber);
  };

  const totalPages = Math.ceil(SupportTicketData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(startIndexC + itemsPerPageC, filteredClientData.length);
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

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
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredSupportTicketData.length
  );
  const slicedHistory = filteredSupportTicketData.slice(startIndex, endIndex);

  const filterClientData = () => {
    let filteredClientData = clientData.filter((client) => {
      const fullName = `${client.firstname} ${client.lastname}`.toLowerCase();
      return (
        fullName.includes(searchQueryC.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQueryC.toLowerCase())
      );
    });

    if (filterOption !== "all") {
      filteredClientData = filteredClientData.filter(
        (client) => client.status === filterOption
      );
    }

    setFilteredClientData(filteredClientData);
  };

  const fetchSupportTicketData = async (client) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const selectedClient = client.email;
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/supportticket/getClientsSupportTickets?clientEmail=${selectedClient}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            selectedClient: selectedClient,
          },
        }
      );
      console.log(response.data);
      if (response && response.data && response.data.length > 0) {
        setSupportTicketData(response.data);
        setIsViewingClient(true);
      } else {
        message.info("No support tickets available for this client.");
        setIsViewingClient(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching support ticket data:", error);
    }
  };

  const filterSupportTicketData = () => {
    let filteredData = SupportTicketData.filter((ticket) => {
      if (!ticket) return false; // Check if ticket is undefined or null
      const description = ticket.issueMessage
        ? ticket.issueMessage.toLowerCase()
        : "";
      const ticketId = ticket.ticketId ? ticket.ticketId.toLowerCase() : "";
      const email = ticket.email ? ticket.email.toLowerCase() : "";
      const filename =
        ticket.files && ticket.files.length > 0
          ? ticket.files[0].filename.toLowerCase()
          : "";

      return (
        description.includes(searchQueryC.toLowerCase()) ||
        ticketId.includes(searchQueryC.toLowerCase()) ||
        email.includes(searchQueryC.toLowerCase()) ||
        filename.includes(searchQueryC.toLowerCase())
      );
    });

    if (filterOption !== "all") {
      filteredData = filteredData.filter(
        (ticket) => ticket && ticket.status === filterOption
      ); // Additional null check
    }

    setFilteredSupportTicketData(filteredData);
  };

  const handleClientChange = (event) => {
    const selectedClient = event.target.value;
    if (selectedClient) {
      setSelectedClient(selectedClient);
    } else {
      // Handle the case where selectedClient is undefined
      console.error("Selected client is undefined.");
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      // Update ticket status to resolved
      await axios.patch(
        `https://sstaxmentors-server.vercel.app/admin/supportticket/resolveSupportTicket/${ticketId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh ticket details after resolving
      fetchSupportTicketData();
    } catch (error) {
      console.error("Error resolving support ticket:", error);
    }
  };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  const handleFieldChange = (field) => {
    setSelectedField(field);
  };

  const handlePreview = async (fileId, filename) => {
    try {
      const authToken = localStorage.getItem("token");
      console.log(fileId);
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
      console.error("Error previewing support ticket:", error);
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

  const handleClientBack = () => {
    setIsViewingClient(false);
    setSelectedClient(null);
  };

  const handleBack = () => {
    handleClientBack();
    setSelectedSupportTicketIndex(-1);
  };

  const handleView = async (index, ticketId) => {
    try {
      // setLoading(true);
      // setSelectedSupportTicketIndex(index);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/supportticket/getSupportTicketUsingTicketid/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const supportticketData = response.data;

      // Store data in local storage
      localStorage.setItem("supportticket", JSON.stringify(supportticketData));

      // Open new tab
      const supportticketWindow = window.open("/supportticket", "_blank");

      if (!supportticketWindow) {
        alert(
          "Please allow pop-ups for this website to view supportticket details."
        );
      }
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching support ticket data:", error);
    }
  };

  if (isViewingClient) {
    return (
      <>
        <NavigationBar />
        <hr></hr>
        <div className="container mx-auto p-10">
          {/* <div className="max-w-2xl  w-full bg-white p-8 rounded-md shadow-md"> */}
          <p className="font-bold text-3xl  text-blue-500 mb-10">
            CLIENT'S SUPPORT TICKETS{" "}
          </p>
          <div className="flex flex-wrap mt-4">
            {selectedSupportTicketIndex !== -1 ? (
              <div className="w-full mb-5">
                <button
                  onClick={handleBack}
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-5"
                >
                  Back
                </button>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-400 mb-3">
                      Support Ticket Details
                    </h3>
                    <p>
                      <strong className="text-gray-600">Ticket Type:</strong>
                      {SupportTicketData[selectedSupportTicketIndex]?.ticketId}
                    </p>
                    <p>
                      <strong className="text-gray-600">Description:</strong>{" "}
                      {
                        SupportTicketData[selectedSupportTicketIndex]
                          ?.issueMessage
                      }
                    </p>
                    <p>
                      <strong className="text-gray-600">Question Type:</strong>{" "}
                      {
                        SupportTicketData[selectedSupportTicketIndex]
                          ?.questionType
                      }
                    </p>
                    <p>
                      <strong className="text-gray-600">Filename:</strong>{" "}
                      {
                        SupportTicketData[selectedSupportTicketIndex]?.files[0]
                          ?.filename
                      }
                    </p>
                    <p>
                      <strong className="text-gray-600">Uploader Name:</strong>{" "}
                      {
                        SupportTicketData[selectedSupportTicketIndex]
                          ?.clientName
                      }
                    </p>
                    <p>
                      <strong className="text-gray-600">Uploader email:</strong>{" "}
                      {
                        SupportTicketData[selectedSupportTicketIndex]
                          ?.clientEmail
                      }
                    </p>
                    <p>
                      <strong className="text-gray-600">Status:</strong>{" "}
                      {SupportTicketData[selectedSupportTicketIndex]?.status}
                    </p>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center mt-4 space-x-4">
                        <button
                          onClick={() =>
                            handlePreview(
                              SupportTicketData[selectedSupportTicketIndex]
                                ?.files[0]?.fileId,
                              SupportTicketData[selectedSupportTicketIndex]
                                ?.files[0]?.filename
                            )
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(
                              SupportTicketData[selectedSupportTicketIndex]
                                ?.files[0]?.fileId,
                              SupportTicketData[selectedSupportTicketIndex]
                                ?.files[0]?.filename
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          Download
                        </button>
                        {SupportTicketData[selectedSupportTicketIndex]
                          ?.status !== "resolved" && (
                          <button
                            onClick={() =>
                              handleResolve(
                                SupportTicketData[selectedSupportTicketIndex]
                                  ?.ticketId
                              )
                            }
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="mb-4 w-full">
                    <button
                      onClick={handleBack}
                      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-5"
                    >
                      Back
                    </button>
                    <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
                      <div className="flex justify-between">
                        {["all", "closed", "open", "resolved"].map((option) => (
                          <div
                            key={option}
                            className={`cursor-pointer ${
                              filterOption === option
                                ? "text-blue-500 font-bold"
                                : "text-gray-500 hover:text-blue-500"
                            } flex items-center mr-4`}
                            onClick={() => handleFilter(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <div>
                        <input
                          id="search"
                          type="text"
                          value={searchQueryC}
                          onChange={(e) => setSearchQueryC(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                          placeholder="Search..."
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 border-b">Sno</th>
                        <th className="py-2 px-4 border-b">Ticket Id</th>
                        <th className="py-2 px-4 border-b">Question Type</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">File name</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slicedHistory.map((ticket, index) => (
                        <tr key={ticket._id}>
                          <td className="py-2 px-4 border-b">
                            {filteredSupportTicketData.length -
                              startIndex -
                              index}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ticket.ticketId}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ticket.questionType}
                          </td>
                          <td className="py-2 px-4 border-b">
                          {truncate(ticket.issueMessage, 40)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ticket.files[0].filename}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ticket.status}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ticket.clientEmail}
                          </td>
                          <td>
                            <button
                              onClick={() => handleView(index, ticket.ticketId)}
                              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <NavigationBar />
        <hr></hr>
        <div className="container mx-auto p-10">
          {/* <div className="max-w-2xl  w-full bg-white p-8 rounded-md shadow-md"> */}
          <p className="font-bold text-3xl  text-blue-500 mb-10">
            SUPPORT TICKET LIST{" "}
          </p>
          <div className="flex flex-wrap mt-4">
            <div className="mb-4 w-full">
              <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
                <div className="flex justify-between ">
                  <div
                    className={`cursor-pointer ${
                      filterOption === "all"
                        ? "text-blue-500 font-bold"
                        : "text-gray-500 hover:text-blue-500"
                    } flex items-center`}
                    onClick={() => handleFilter("all")}
                  >
                    <span
                      className={`mr-2 ${
                        filterOption === "all"
                          ? "border-b-2 border-blue-500"
                          : ""
                      }`}
                    >
                      All
                    </span>
                  </div>
                  <div className="mx-10"></div>
                  <div
                    className={`cursor-pointer ${
                      filterOption === "inactive"
                        ? "text-red-500 font-bold"
                        : "text-gray-500 hover:text-red-500"
                    } flex items-center`}
                    onClick={() => handleFilter("inactive")}
                  >
                    <span
                      className={`mr-2 ${
                        filterOption === "inactive"
                          ? "border-b-2 border-red-500"
                          : ""
                      }`}
                    >
                      Inactive
                    </span>
                  </div>
                  <div className="mx-10"></div>
                  <div
                    className={`cursor-pointer ${
                      filterOption === "active"
                        ? "text-green-500 font-bold"
                        : "text-gray-500 hover:text-green-500"
                    } flex items-center`}
                    onClick={() => handleFilter("active")}
                  >
                    <span
                      className={`mr-2 ${
                        filterOption === "active"
                          ? "border-b-2 border-green-500"
                          : ""
                      }`}
                    >
                      Active
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQueryC}
                  onChange={(e) => setSearchQueryC(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
              </div>
            </div>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">S No</th>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone Number</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slicedHistoryC.map((client, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                      {filteredClientData.length - startIndexC - index}
                    </td>
                    <td className="py-2 px-4 border-b">{client.firstname}</td>
                    <td className="py-2 px-4 border-b">{client.lastname}</td>
                    <td className="py-2 px-4 border-b">{client.email}</td>
                    <td className="py-2 px-4 border-b">
                      {client.Phone_number}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={
                          client.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {client.status === "active" && (
                        <button
                          onClick={() => fetchSupportTicketData(client)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="pagination flex justify-center items-center my-4">
              <li
                className={`page-item ${currentPageC === 1 ? "disabled" : ""}`}
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
          </div>
        </div>
      </div>
    );
  }
};

export default SupportTicket;
