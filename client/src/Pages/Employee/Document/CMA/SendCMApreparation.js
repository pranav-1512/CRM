import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../NavigationBar/NavigationBar";

const SendCMApreparation = () => {
  const [clients, setClients] = useState([]);

  const [filteredClientData, setFilteredClientData] = useState([]);

  const [selectedClient, setSelectedClient] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [cmaPreparationTypes, setCmaPreparationTypes] = useState([]);
  const [selectedCmaPreparationType, setSelectedCmaPreparationType] =
    useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  // Pagination state variables
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15); // You can change this value as needed
  let isMounted = true;
  let navigate = useNavigate();


  useEffect(() => {
    filterClientData();
  }, [clients, searchQuery, filterOption]); // Updated dependencies

  const filterClientData = () => {
    let filteredClients = clients.filter((client) => {
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

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(startIndexC + itemsPerPageC, filteredClientData.length);
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const clientsResponse = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/client/getClients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(clientsResponse.data);

        const cmaPreparationTypesResponse = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/cma/getCMApreparation"
        );
        setCmaPreparationTypes(cmaPreparationTypesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!isMounted && error.response && error.response.status === 500) {
          // If the response status is 401, display an alert and redirect to login page
          isMounted = true
          alert("Session expired. Please login again.");
          // window.location.href = '/'; // Change the URL accordingly
          navigate("/");
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPagesC = Math.ceil(clients.length / itemsPerPageC);

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

  // const startIndexC = (currentPageC - 1) * itemsPerPageC;
  // const endIndexC = Math.min(startIndexC + itemsPerPageC, clients.length);
  // const slicedHistoryC = clients.slice(startIndexC, endIndexC);

  // Pagination function
  const paginateClients = (pageNumber) => setCurrentPageClient(pageNumber);

  // Logic to get current clients for the current page
  const indexOfLastClient = currentPageClient * itemsPerPageClient;
  const indexOfFirstClient = indexOfLastClient - itemsPerPageClient;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const handleViewClient = async (client) => {
    setSelectedClient(client.email);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/getCompanyNamesOfClient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            clientEmail: client.email,
          },
        }
      );
      setCompanies(response.data);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching company names:", error);
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleCmaPreparationTypeChange = (event) => {
    setSelectedCmaPreparationType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const dataForBackend = new FormData();
    dataForBackend.append("clientEmail", selectedClient);
    dataForBackend.append("company", selectedCompany);
    dataForBackend.append("cmaPreparationTypeName", selectedCmaPreparationType);
    dataForBackend.append("description", description);
    dataForBackend.append("remarks", remarks);
    dataForBackend.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/document/cma/sendNewCMApreparation",
        dataForBackend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Backend Response:", response.data);

      setSelectedClient("");
      setSelectedCompany("");
      setSelectedCmaPreparationType("");
      setDescription("");
      setRemarks("");
      setFile(null);
      setIsLoading(false);
      setShowForm(false);
      message.success("CMA Preparation successfully submitted.");
    } catch (error) {
      console.error("Error sending data to the backend:", error);
      setIsLoading(false);
      message.error("Error submitting CMA Preparation. Please try again.");
    }
  };

  const handleBackButtonClick = () => {
    setShowForm(false); // Set showForm state to false to hide the form
  };

  return (
    <div className="">
      <div className="">
        {showForm ? (
          <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
              <h2 className="text-3xl font-semibold text-gray-500 mb-4 text-center">
                Add New CMA Preparation
              </h2>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="company"
                >
                  Select Company:
                </label>
                <select
                  id="company"
                  name="company"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-500 text-lg mb-2">
                  CMA Preparation Type:
                </label>
                {cmaPreparationTypes && cmaPreparationTypes.length > 0 ? (
                  cmaPreparationTypes
                    .filter((returnType) => returnType.status === "active")
                    .map((cmaPreparationType) => (
                      <div
                        key={cmaPreparationType}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="radio"
                          id={cmaPreparationType.name}
                          name="cmaPreparationType"
                          value={cmaPreparationType.name}
                          checked={
                            selectedCmaPreparationType ===
                            cmaPreparationType.name
                          }
                          onChange={handleCmaPreparationTypeChange}
                          className="mr-2"
                        />
                        <label htmlFor={cmaPreparationType.name}>
                          {cmaPreparationType.name}
                        </label>
                      </div>
                    ))
                ) : (
                  <p>No CMA preparation types available</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="description"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="remarks"
                  className="block text-gray-500 text-lg mb-2"
                >
                  Remarks:
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={remarks}
                  onChange={handleRemarksChange}
                  className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="file"
                >
                  Upload File:
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />
              </div>

              <div className="flex justify-center items-center mt-12 space-x-4">
                {/* Back button */}
                <button
                  className="inline-block w-56 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  type="button"
                  onClick={handleBackButtonClick} // Call handleBackButtonClick function on click
                >
                  Back
                </button>
                {/* Submit button */}
                <button
                  className="inline-block w-56 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  type="button"
                  onClick={handleSubmit}
                >
                {isLoading ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <NavigationBar/>
            <hr></hr>
          <div className="container mx-auto p-10">
            <p className="font-bold text-3xl text-blue-500 mb-10">
              CMA PREPARATION
            </p>

            <div className="flex flex-wrap mt-4">
              <div className="mb-4 w-full">
                <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
                  <div className="flex justify-between">
                    <div
                      className={`cursor-pointer ${
                        filterOption === "all"
                          ? "text-blue-500 font-bold"
                          : "text-gray-500 hover:text-blue-500"
                      } flex items-center`}
                      onClick={() => setFilterOption("all")}
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
                      onClick={() => setFilterOption("inactive")}
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
                      onClick={() => setFilterOption("active")}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  {slicedHistoryC
                    .filter((client) => {
                      if (filterOption === "all") {
                        return true;
                      }
                      return client.status === filterOption;
                    })
                    .filter((client) => {
                      const fullName =
                        `${client.firstname} ${client.lastname}`.toLowerCase();
                      return (
                        fullName.includes(searchQuery.toLowerCase()) ||
                        client.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((client, index) => (
                      <tr
                        key={index}
                        className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="py-2 px-4 border-b">
                          {filteredClientData.length - startIndexC - index}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {client.firstname}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {client.lastname}
                        </td>
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
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleViewClient(client)}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-center items-center my-4">
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
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendCMApreparation;
