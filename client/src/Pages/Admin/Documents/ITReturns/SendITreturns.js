import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../../NavigationBar/NavigationBar";

const SendITreturns = () => {
  const [clients, setClients] = useState([]);
  const [filteredClientData, setFilteredClientData] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [itReturnsTypes, setITReturnsTypes] = useState([]);
  const [selectedReturnType, setSelectedReturnType] = useState("");
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/client/getClients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const paginateClients = (pageNumber) => {
    setCurrentPageClient(pageNumber);
  };

  const fetchCompanies = async (clientEmail) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/getCompanyNamesOfClient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            clientEmail: clientEmail,
          },
        }
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  useEffect(() => {
    const fetchITReturnsTypes = async (c) => {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/itreturns/getITReturnsFields"
        );
        setITReturnsTypes(response.data);
      } catch (error) {
        console.error("Error fetching IT returns types:", error);
      }
    };

    fetchITReturnsTypes();
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

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowForm(true);
    fetchCompanies(client.email);
  };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleReturnTypeChange = (e) => {
    setSelectedReturnType(e.target.value);
  };

  const handleBackButtonClick = () => {
    setShowForm(false); // Set showForm state to false to hide the form
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("remarks", remarks);
    formData.append("selectedCompany", selectedCompany);
    formData.append("selectedReturnType", selectedReturnType);

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    formData.append("selectedClient", JSON.stringify(selectedClient.email));

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/document/itreturns/sendITreturns",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      setIsLoading(false);
      setTitle("");
      setDescription("");
      setFiles([]);
      setRemarks("");
      setSelectedCompany("");
      setSelectedReturnType("");
      setSelectedClient(null);
      setShowForm(false);
      message.success("IT Returns submitted successfully.");
    } catch (error) {
      console.error("Error sending reminder:", error);
      setIsLoading(false);
      message.error("Failed to submit IT Returns. Please try again later.");
    }
  };

  // const filteredClients = clients
  //   .filter((client) => {
  //     if (filterOption === "all") {
  //       return true;
  //     }
  //     return client.status === filterOption;
  //   })
  //   .filter((client) => {
  //     const fullName = `${client.firstname} ${client.lastname}`.toLowerCase();
  //     return (
  //       fullName.includes(searchQuery.toLowerCase()) ||
  //       client.email.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });

  // const indexOfLastClient = currentPageClient * itemsPerPageClient;
  // const indexOfFirstClient = indexOfLastClient - itemsPerPageClient;
  // const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

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

  return (
    <div className="">
      <div className="">
        {showForm ? (
          <div>
            <NavigationBar />
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
              <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
                <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
                  IT RETURNS FORM{" "}
                </p>
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
                    Type of IT Returns:
                  </label>
                  {itReturnsTypes
                    .filter((returnType) => returnType.status === "active")
                    .map((returnType) => (
                      <div key={returnType._id}>
                        <input
                          type="radio"
                          id={`returnType_${returnType.name}`}
                          name="returnType"
                          value={returnType.name}
                          checked={selectedReturnType === returnType.name}
                          onChange={handleReturnTypeChange}
                        />
                        <label
                          htmlFor={`returnType_${returnType.name}`}
                          className="ml-2 mr-4"
                        >
                          {returnType.name}
                        </label>
                      </div>
                    ))}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-500 text-lg mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                    rows="3"
                    value={description}
                    onChange={handleDescriptionChange}
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-500 text-lg mb-2"
                    htmlFor="remarks"
                  >
                    Remarks:
                  </label>
                  <textarea
                    className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                    rows="3"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
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
          </div>
        ) : (
          <div>
            <NavigationBar />
            <hr></hr>
            <div className="container mx-auto p-5 md:p-10">
              <p className="font-bold text-3xl  text-blue-500 mb-10">
                SEND IT RETURNS{" "}
              </p>
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
                      <div
                        className={`cursor-pointer ${
                          filterOption === "inactive"
                            ? "text-red-500 font-bold"
                            : "text-gray-500 hover:text-red-500"
                        } flex items-center mb-2 mx-3  md:mb-0 md:mx-10`}
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
                      <div
                        className={`cursor-pointer ${
                          filterOption === "active"
                            ? "text-green-500 font-bold"
                            : "text-gray-500 hover:text-green-500"
                        } flex items-center mb-2 mx-3  md:mb-0 md:mx-10`}
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
                            className={
                              (index + 1) % 2 === 0 ? "bg-gray-100" : ""
                            }
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
                            <td className="py-2 px-4 border-b">
                              {client.email}
                            </td>
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
                                {client.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b">
                              {client.status === "active" && (
                                <button
                                  onClick={() => handleViewClient(client)}
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
          </div>
        )}
      </div>
    </div>
  );
};
export default SendITreturns;
