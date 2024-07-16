import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../NavigationBar/NavigationBar";


const SendGSTNotice = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [filteredClientData, setFilteredClientData] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [gstNoticeTypes, setGSTNoticeTypes] = useState([]);
  const [selectedNoticeType, setSelectedNoticeType] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);
  let isMounted = true;
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch clients
        const clientsResponse = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/client/getClients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
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

  const handleClientChange = async (event) => {
    setSelectedClient(event.target.value);
    try {
      const token = localStorage.getItem("token");

      // Fetch companies based on the selected client
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/getCompanyNamesOfClient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            clientEmail: event.target.value,
          },
        }
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  useEffect(() => {
    const fetchGSTNoticeTypes = async () => {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/gstnotice/gstFields"
        );
        setGSTNoticeTypes(response.data);
      } catch (error) {
        console.error("Error fetching GST notice types:", error);
      }
    };

    fetchGSTNoticeTypes();
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleNoticeTypeChange = (event) => {
    setSelectedNoticeType(event.target.value);
  };

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const dataForBackend = new FormData();
    dataForBackend.append("selectedClient", selectedClient);
    dataForBackend.append("selectedCompany", selectedCompany);
    dataForBackend.append("selectedNoticeType", selectedNoticeType);
    dataForBackend.append("description", description);
    dataForBackend.append("remarks", remarks);
    dataForBackend.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/document/gstnotice/sendGSTnotice",
        dataForBackend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Data submitted successfully");
      console.log("Backend Response:", response.data);

      // Clear form data after submission
      setSelectedCompany("");
      setSelectedNoticeType("");
      setDescription("");
      setRemarks("");
      setFile(null);
      setIsLoading(false);
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      message.error("Error submitting data");
      console.error("Error sending data to the backend:", error);
      setIsLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    setShowForm(false); // Set showForm state to false to hide the form
  };

  const handleViewClient = async (client) => {
    setSelectedClient(client.email);
    try {
      const token = localStorage.getItem("token");

      // Fetch companies based on the selected client
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

      // Show the form
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  // Pagination
  // const indexOfLastClient = currentPageClient * itemsPerPageClient;
  // const indexOfFirstClient = indexOfLastClient - itemsPerPageClient;
  // const filteredClientData = clients
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
  // const currentClientData = filteredClientData.slice(
  //   indexOfFirstClient,
  //   indexOfLastClient
  // );

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

  const paginateClients = (pageNumber) => setCurrentPageClient(pageNumber);

  return (
    <div className="">
      <NavigationBar/>
      <hr></hr>
      <div className="">
        {showForm ? (
          <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
              <h2 className="text-3xl font-semibold text-gray-500 mb-4 text-center">
                GST Notice
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
                  Type of GST Notice:
                </label>
                {gstNoticeTypes
                  .filter((returnType) => returnType.status === "active")
                  .map((noticeType) => (
                    <div key={noticeType._id}>
                      <input
                        type="radio"
                        id={`noticeType_${noticeType.name}`}
                        name="noticeType"
                        value={noticeType.name}
                        checked={selectedNoticeType === noticeType.name}
                        onChange={handleNoticeTypeChange}
                      />
                      <label
                        htmlFor={`noticeType_${noticeType.name}`}
                        className="ml-2 mr-4"
                      >
                        {noticeType.name}
                      </label>
                    </div>
                  ))}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="remarks"
                >
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter Remarks"
                  className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                  style={{ width: "100%" }}
                />
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
          <div className="container mx-auto p-10">
            <p className="font-bold text-3xl text-blue-500 mb-10">GST NOTICE</p>

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
        )}
      </div>
    </div>
  );
};

export default SendGSTNotice;
