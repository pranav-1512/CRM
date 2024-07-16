import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../../NavigationBar/NavigationBar";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function ViewKYC() {
  const [clientData, setClientData] = useState([]);
  const [filteredClientData, setFilteredClientData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewingClient, setIsViewingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [searchQueryC, setSearchQueryC] = useState("");
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15); // Adjust items per page as needed
  const [currentPageITReturns, setCurrentPageITReturns] = useState(1);
  const [itemsPerPageITReturns] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);
  const [KYCData, setKYCData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    filterClientData();
  }, [clientData, searchQueryC, filterOption]);

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

  const handleClientBack = () => {
    setIsViewingClient(false);
    setSelectedClient(null);
  };
  const handleBack = () => {
    // If not viewing IT return details, go back to client table
    handleClientBack();
  };

  const totalPagesC = Math.ceil(clientData.length / itemsPerPageC);

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

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(
    startIndexC + itemsPerPageC,
    filteredClientData.length
  );
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

  const fetchKYCData = async (client) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/document/kyc/getKYCOfClient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            selectedClient: client.email,
          },
        }
      );
      console.log(response.data);
      if (response.data && response.data.kycdata.length > 0) {
        console.log("Yes");
        setKYCData(response.data.kycdata);
        setSelectedClient(client);
        setIsViewingClient(true);
        console.log(KYCData);
      } else {
        // Display an alert when there are no files available
        setIsViewingClient(false);
        message.info(" No files available for this client.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  const handlePreview = async (filename, email) => {
    try {
      const authToken = localStorage.getItem("token");

      // Send request to fetch the file
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/kyc/previewkycAE/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            email: email,
          },
          responseType: "arraybuffer",
        }
      );

      // Create blob from response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open the file preview in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleDownload = async (filename, email) => {
    try {
      const authToken = localStorage.getItem("token");

      // Send request to download the file
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/kyc/downloadkycAE/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            email: email,
          },
          responseType: "arraybuffer",
        }
      );

      // Create blob from response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element to trigger the download
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

  if (isViewingClient) {
    return (
      <>
        <NavigationBar />

        <button
          onClick={handleBack}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5 ml-10"
        >
          Back
        </button>

        <div className="m-5">
          {KYCData.map((item, index) => (
            <div
              key={index}
              className={
                "m-5 shadow-lg rounded-md" +
                (index !== KYCData.length - 1
                  ? " border-r-2 border-gray-200"
                  : "")
              }
            >
              <div className="p-4 grid grid-cols-2 m-20 min-h-40 relative">
                <div className="flex items-center">
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-200 "
                    style={{ width: "1px", left: "calc(33.33% - 0.5px)" }}
                  ></div>
                  <h5 className="font-semibold text-3xl text-blue-700">
                    {item.category.toUpperCase()}
                  </h5>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    Filename:{" "}
                    {item.filename.slice(item.filename.indexOf("_") + 1)}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Timestamp: {item.timestamp.slice(8, 10)}/
                    {item.timestamp.slice(5, 7)}/{item.timestamp.slice(0, 4)}
                  </p>
                  <div className="mt-4">
                    {item.filename.slice(-3).toLowerCase() === "pdf" && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mr-2"
                        onClick={() => {
                          handlePreview(item.filename, item.userEmail);
                        }}
                      >
                        Preview
                      </button>
                    )}
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg"
                      onClick={() => {
                        handleDownload(item.filename, item.userEmail);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="container mx-auto p-5 md:p-10">
        <p className="font-bold text-3xl text-blue-500 mb-10">KYC </p>
        <div className="flex flex-wrap mt-2 md:mt-4">
          <div className="mb-2 md:mb-4 w-full">
            <div className="flex flex-col md:flex-row justify-between border border-t-3 border-b-3 border-gray-200 p-3 md:p-5">
              <div className="flex flex-wrap justify-center md:justify-start">
                <div
                  className={`cursor-pointer ${
                    filterOption === "all"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center mb-2 mx-3 md:mb-0 md:mr-10`}
                  onClick={() => handleFilter("all")}
                >
                  <span
                    className={`mr-2 ${
                      filterOption === "all" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    All
                  </span>
                </div>
                <div
                  className={`cursor-pointer ${
                    filterOption === "inactive"
                      ? "text-red-500 font-bold"
                      : "text-gray-500 hover:text-red-500"
                  } flex items-center mb-2 mx-3  md:mb-0 md:mx-10`}
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
                <div
                  className={`cursor-pointer ${
                    filterOption === "active"
                      ? "text-green-500 font-bold"
                      : "text-gray-500 hover:text-green-500"
                  } flex items-center mb-2 mx-3  md:mb-0 md:mx-10`}
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
                className="border border-gray-300 rounded px-3 py-2 mt-2 md:mt-0 w-full md:w-auto"
              />
            </div>
            <div className="overflow-x-auto">
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
                          {client.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {client.status === "active" && (
                          <button
                            onClick={() => fetchKYCData(client)}
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
            </div>
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
    </div>
  );
}

export default ViewKYC;
