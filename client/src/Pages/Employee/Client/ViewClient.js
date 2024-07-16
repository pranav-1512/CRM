import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../NavigationBar/NavigationBar";
import { message } from "antd";



function ViewClient() {
  const [clientData, setClientData] = useState([]);
  const [filteredClientData, setFilteredClientData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedclienttype, setSelectedClientType] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isViewingClient, setIsViewingClient] = useState(false);
  const [showMoreMap, setShowMoreMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all"); // Added state for filter option
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [newType, setNewType] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const handleDropdownChange = (value) => {
    setSelectedOption(value);

    let filteredClients = [...clientData];

    // Filter based on selected option and typeOfC
    if (value) {
      console.log(value)
      filteredClients = filteredClients.filter(
        (client) => client.typeOfC === value
      );
    }

    // Apply additional filtering based on search query and client status if needed
    if (searchQuery) {
      filteredClients = filteredClients.filter((client) => {
        const fullName = `${client.firstname} ${client.lastname}`.toLowerCase();
        return (
          fullName.includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (filterOption !== "all") {
      filteredClients = filteredClients.filter(
        (client) => client.status === filterOption
      );
    }
    setFilteredClientData(filteredClients);
  };
  
  const totalPages = Math.ceil(clientData.length / itemsPerPage);

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
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredClientData.length
  );
  const slicedHistory = filteredClientData.slice(startIndex, endIndex);

  const openTypeModal = (client) => {
    setSelectedClientType(client);
    setIsTypeModalOpen(true);
    console.log(selectedclienttype);
  };

  const closeTypeModal = () => {
    setSelectedClient(null);
    setIsTypeModalOpen(false);
  };

  const changeClientType = async (client) => {
    // console.log(alert("hi"))
    try {
      // console.log(selectedclienttype);
      const response = await axios.put(
        `https://sstaxmentors-server.vercel.app/admin/client/changeclienttype/${selectedclienttype}`,
        { typeOfC: newType }
      );
      if (response.status === 200) {
        // console.log("Client type changed successfully");
        closeTypeModal();
        fetchClientData();
        message.success("Client type changed successfully");

      } else {
        console.error("Failed to change client type:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error changing client type:", error.message);
      // Handle error
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    filterClientData();
  }, [clientData, searchQuery, filterOption]); // Updated dependencies

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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching client data:", error);
      setIsLoading(false);
    }
  };

  const filterClientData = () => {
    let filteredClients = clientData.filter((client) => {
      const fullName = `${client.firstname} ${client.lastname}.toLowerCase()`;
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (filterOption !== "all") {
      filteredClients = filteredClients.filter(
        (client) => client.status === filterOption
      );
    }

    setFilteredClientData(filteredClients);
  };

  const handleBlock = (client) => {
    setSelectedClient(client);
    setIsConfirmationModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleConfirmation = async (confirmation) => {
    setIsConfirmationModalOpen(false);
    if (confirmation === "yes" && selectedClient) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "https://sstaxmentors-server.vercel.app/admin/client/blockclient",
          { email: selectedClient.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchClientData();
      } catch (error) {
        console.error("Error blocking client:", error);
      }
    }
  };

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/company/previewCompanyFile/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      // Convert the response data from base64 to a Uint8Array
      const bytes = new Uint8Array(response.data);

      // Create a Blob object from the Uint8Array
      const blob = new Blob([bytes], { type: "application/pdf" });

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/company/downloadCompanyFile/${filename}`,
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
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleUnblock = async (client) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/client/unblockclient",
        { email: client.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchClientData();
    } catch (error) {
      console.error("Error unblocking client:", error);
    }
  };
  const handleView = async (client) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/viewEntireClientDetails",
        {
          params: { email: client.email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data && response.data.clients.length > 0) {
        const formattedClients = response.data.clients.map((client) => {
          return { ...client, DOB: formatDate(client.DOB) }; // Format DOB here
        });

        // Store data in local storage
        localStorage.setItem("viewclient", JSON.stringify(formattedClients));

        // Open new tab for each client

        const viewclientWindow = window.open("/viewclient", "_blank");

        if (!viewclientWindow) {
          alert(
            "Please allow pop-ups for this website to view client details."
          );
        }
      } else {
        console.error("Failed to fetch client details");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  const handleBack = () => {
    setIsViewingClient(false);
  };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  if (isViewingClient) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap -mx-4"></div>
        <p className="font-bold text-3xl text-blue-500 mb-10">
          CLIENT DETAILS{" "}
        </p>
        <div>
          <p>
            <strong>First Name:</strong> {selectedClient[0].firstname}
          </p>
          <p>
            <strong>Last Name:</strong> {selectedClient[0].lastname}
          </p>
          <p>
            <strong>Date of Birth:</strong> {formatDate(selectedClient[0].DOB)}
          </p>
          <p>
            <strong>Address:</strong> {selectedClient[0].address}
          </p>
          <p>
            <strong>Street Name:</strong> {selectedClient[0].streetname}
          </p>
          <p>
            <strong>City:</strong> {selectedClient[0].city}
          </p>
          <p>
            <strong>Landmark:</strong> {selectedClient[0].landmark}
          </p>
          <p>
            <strong>State:</strong> {selectedClient[0].state}
          </p>
          {/* <p><strong>Company Name:</strong> {selectedClient[0].companyname}</p> */}
          <p>
            <strong>Country:</strong> {selectedClient[0].country}
          </p>
          <p>
            <strong>Email:</strong> {selectedClient[0].email}
          </p>
          <p>
            <strong>Phone Number:</strong> {selectedClient[0].Phone_number}
          </p>
          <p>
            <strong>Is Verified:</strong>{" "}
            {selectedClient[0].isverified ? "Yes" : "No"}
          </p>
          <p>
            <strong>Status:</strong> {selectedClient[0].status}
          </p>
        </div>

        {/* Display company details */}
        <p className="font-bold text-3xl text-blue-500 mb-10">
          CLIENT DETAILS{" "}
        </p>
        {selectedClient.slice(1).map((company, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded-md">
            <h3 className="text-xl font-bold mb-4">
              {company.companyName || "Company Name Not specified"}
            </h3>
            <p>{`Company Type: ${getCompanyType(company.companyType)}`}</p>
            {/* Display more details if "Show More" is clicked */}
            {showMoreMap[company._id] && (
              <>
                <p>{`Address: ${getAddress(company.address)}`}</p>
                <p>{`Office Number: ${
                  company.officeNumber || "Not specified"
                }`}</p>
                {/* Display subInputs */}
                {company.subInputs &&
                  Object.entries(company.subInputs).map(
                    ([subInputName, subInputData]) => (
                      <div key={subInputName} className="mt-4">
                        <p className="font-bold">{`SubInputName: ${subInputName}`}</p>
                        {Object.entries(subInputData).map(([key, value]) => (
                          <p key={key} className="ml-4">{`${key}: ${value}`}</p>
                        ))}
                      </div>
                    )
                  )}
                {/* Display files for each company type */}
                {company.mainNameFiles &&
                  Object.entries(company.mainNameFiles).map(
                    ([companyType, companyFiles]) => (
                      <div key={companyType} className="mt-4">
                        <p>{`${companyType} Files:`}</p>
                        {Object.entries(companyFiles).map(
                          ([fileType, files]) => (
                            <div key={fileType} className="mt-2">
                              <p className="font-bold">{fileType}:</p>
                              {Array.isArray(files) &&
                                files.map((file, index) => (
                                  <div key={index} className="mt-2">
                                    <p>{`SubInputName: ${
                                      file.subInputName || "Not specified"
                                    }`}</p>
                                    <p>{`Filename: ${
                                      file.filename || "File Name Not specified"
                                    }`}</p>
                                    <button
                                      onClick={() =>
                                        handlePreview(file.filename)
                                      }
                                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                    >
                                      Preview
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDownload(file.filename)
                                      }
                                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    >
                                      Download
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
              </>
            )}
            <button
              onClick={() =>
                setShowMoreMap((prevState) => ({
                  ...prevState,
                  [company._id]: !prevState[company._id],
                }))
              }
              className="text-blue-500 mt-4"
            >
              {showMoreMap[company._id] ? "Show Less" : "Show More"}
            </button>
          </div>
        ))}
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div>
    {!isTypeModalOpen && <NavigationBar />}
      <hr></hr>
      <div className="container mx-auto p-10">
        <p className="font-bold text-3xl text-blue-500 mb-10">CLIENT LIST </p>
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
                      filterOption === "all" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    All
                  </span>
                </div>
                <div className="mx-10"></div> {/* Add some space */}
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
                <div className="mx-10"></div> {/* Add some space */}
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

              <div className="flex items-center">
                <select
                  onChange={(e) => handleDropdownChange(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 mr-2"
                >
                  <option value="">Select Option</option>
                  <option value="GST Clients">GST Clients</option>
                  <option value="Tax Audit Clients"> Tax Audit Clients</option>
                  <option value="Company Clients">Company Clients</option>
                  <option value="Accounting Clients">Accounting Clients </option>
                  <option value="others">Other Clients </option>
                </select>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </div>
            </div>
          </div>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S No</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">View</th>
                {/* <th className="py-2 px-4 border-b">Block</th> */}
              </tr>
            </thead>
            <tbody>
              {slicedHistory.map((client, index) => (
                <tr
                  key={index}
                  className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 px-4 border-b">
                    {filteredClientData.length - startIndex - index}
                  </td>
                  <td className="py-2 px-4 border-b">{client.firstname}</td>
                  <td
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={() => openTypeModal(client.email)}
                  >
                    {client.typeOfC}
                  </td>
                  <td className="py-2 px-4 border-b">{client.email}</td>
                  <td className="py-2 px-4 border-b">{client.Phone_number}</td>
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
                    {/* Render actions based on client status */}
                    {client.status === "active" && (
                      <>
                        <button
                          onClick={() => handleView(client)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </>
                    )}
                    {client.status === "inactive" && (
                      <>
                        <button
                          onClick={() => handleView(client)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </>
                    )}
                  </td>
                    

                  <td></td>
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

        {isTypeModalOpen && selectedclienttype && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-md">
              <p className="text-xl font-semibold mb-4">Change Client Type</p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setNewType("GST Clients")}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    newType === "GST Clients" && "font-bold"
                  }`}
                >
                  GST Clients 
                </button>
                <button
                  onClick={() => setNewType("Tax Audit Clients")}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    newType === "Tax Audit Clients" && "font-bold"
                  }`}
                >
                  Tax Audit Clients
                </button>
                <button
                  onClick={() => setNewType("Company Clients")}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    newType === "Company Clients" && "font-bold"
                  }`}
                >
                   Company Clients
                </button>
                <button
                  onClick={() => setNewType("Accounting Clients")}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    newType === "Accounting Clients" && "font-bold"
                  }`}
                >
                  Accounting Clients
                </button>
                <button
                  onClick={() => setNewType("others")}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    newType === "others" && "font-bold"
                  }`}
                >
                  others
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <button
                onClick={() => changeClientType(selectedclienttype)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Change
                </button>
                <button
                  onClick={closeTypeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getAddress = (address) => {
  if (!address) return "Not specified";
  const { streetName, city, state, country, postalCode, landmark } = address;
  return `${streetName}, ${city}, ${state}, ${country} - ${postalCode}, Landmark: ${
    landmark || "Not specified"
  }`;
};

// Helper function to format company type
const getCompanyType = (companyType) => {
  if (!companyType) return "Not specified";
  return Object.keys(companyType)
    .filter((key) => companyType[key].selected)
    .join(", ");
};

export default ViewClient;
