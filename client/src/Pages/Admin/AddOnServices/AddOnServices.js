import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const AddOnServicePage = () => {
  const { serviceId } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [filteredClientData, setFilteredClientData] = useState([]);


  const [isViewingService, setIsViewingService] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15);
  const navigate = useNavigate();
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  const paginateClients = (pageNumber) => {
    setCurrentPageClient(pageNumber);
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
  // const currentClients = filteredClients.slice(
  //   indexOfFirstClient,
  //   indexOfLastClient
  // );

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
  const endIndexC = Math.min(startIndexC + itemsPerPageC,  filteredClientData.length);
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

  useEffect(() => {
    const fetchAddOnServices = async () => {
      if (!selectedClient) {
        setServices([]);
        return;
      }
      setLoading(true);
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `https://sstaxmentors-server.vercel.app/admin/addonservice/getalladdonservices`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: {
              clientId: selectedClient,
            },
          }
        );
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching add-on services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddOnServices();
  }, [selectedClient]);

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleView = async (serviceId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        `https://sstaxmentors-server.vercel.app/admin/addonservice/openService`,
        {
          serviceId: serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setServiceDetails(response.data.service);
      // setIsViewingService(true);
      // setSelectedServiceId(serviceId);
      // const handleViewDetails= (index) => {
      const addonserviceData = response.data.service;

      // Store data in local storage
      localStorage.setItem("addonservice", JSON.stringify(addonserviceData));

      // Open new tab
      const addonserviceWindow = window.open("/addonservice", "_blank");

      if (!addonserviceWindow) {
        alert(
          "Please allow pop-ups for this website to view addonservice details."
        );
      }
      // };
    } catch (error) {
      console.error("Error handling view:", error);
    }
  };

  const handleSolve = async () => {
    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        `https://sstaxmentors-server.vercel.app/admin/addonservice/solveService`,
        {
          serviceId: selectedServiceId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Refresh the add-on services list
      // const response = await axios.get(`https://sstaxmentors-server.vercel.app/admin/getaddonservices`, {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`,
      //   },
      //   params: {
      //     clientId: selectedClient,
      //   }
      // });
      // setServices(response.data.addOnServices);
      // setIsViewingService(false);
      fetchServiceDetails(serviceId);
    } catch (error) {
      console.error("Error handling solve:", error);
    }
  };

  const fetchServiceDetails = async (serviceId) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/getServiceDetails/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setServiceDetails(response.data.serviceDetails);
    } catch (error) {
      console.error("Error fetching service details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    setShowForm(false); // Set showForm state to false to hide the form
  };

  const handleViewClient = (client) => {
    console.log(client.email);
    setSelectedClient(client.email);
    setShowForm(true);
    // fetchCompanies(client.email);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleBack = () => {
    setIsViewingService(false);
    setSelectedServiceId("");
  };

  return (
    <div>
      {showForm ? (
        <div>
          <NavigationBar />
          <hr></hr>
          {!isViewingService ? (
            <div>
              <p className="font-bold text-3xl text-blue-500 mb-10">
                ADD ON SERVICES{" "}
              </p>

              <button
                className="m-4 inline-block w-56 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                type="button"
                onClick={handleBackButtonClick} // Call handleBackButtonClick function on click
              >
                Back
              </button>

              <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    services.map((service, index) => {
                      if (service.email === selectedClient) {
                        return (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }
                          >
                            <td className="border px-4 py-2">
                              {formatDate(service.timestamp)}
                            </td>
                            <td className="border px-4 py-2">
                           
                              {service.description?.length > 20 
                                ? service.description.substring(0, 17) + '...' 
                                : service.description}
                            </td>
                            <td className="border px-4 py-2">
                              {service.status}
                            </td>
                            <td className="border px-4 py-2">
                              <button
                                onClick={() => handleView(service._id)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      } else {
                        return null; // If service email doesn't match selectedClient, don't render anything
                      }
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <button onClick={handleBack}>Back</button>
              <div className="p-4">
                <p className="font-bold text-3xl text-blue-500 mb-10">
                  ADD ON SERVIVE DETAILS{" "}
                </p>

                <div>
                  <p>Service ID: {serviceDetails.serviceId}</p>
                  <p>Status: {serviceDetails.status}</p>
                  <p>
                    Timestamp:{" "}
                    {new Date(serviceDetails.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold mb-2">Description:</h3>
                  <p>{serviceDetails.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Services:</h3>
                  {serviceDetails.services ? (
                    Object.entries(serviceDetails.services).map(
                      ([category, services]) => (
                        <div key={category}>
                          <h4>{category}</h4>
                          <ul>
                            {services.map((subService, index) => (
                              <li key={index}>{subService}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )
                  ) : (
                    <p>No services available</p>
                  )}
                </div>

                {serviceDetails.status !== "resolved" && (
                  <div className="mt-4">
                    <button
                      onClick={handleSolve}
                      className="bg-green-500 text-white p-2 rounded-md"
                    >
                      Solve
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <NavigationBar />
          <hr></hr>
          <div className="container mx-auto p-10">
            <p className="font-bold text-3xl text-blue-500 mb-10">
              ADD ON SERVICES{" "}
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
                          {client.status === "active" ? "Active" : "Inactive"}
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
        </div>
      )}
    </div>
  );
};

export default AddOnServicePage;
