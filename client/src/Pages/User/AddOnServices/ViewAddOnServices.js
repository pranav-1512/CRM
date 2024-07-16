import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

function ViewAddOnServices() {
  let isMounted;
  let navigate = useNavigate();
  const [addOnServices, setAddOnServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isViewingService, setIsViewingService] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  useEffect(() => {
    fetchUserAddOnServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchUserAddOnServices = async () => {
    isMounted = true;
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/addonservice/getUserAddOnService",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setAddOnServices(response.data);
    } catch (error) {
      console.error("Error fetching user add-on services:", error);
      if (isMounted && error.response && error.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  // const handleViewDetails = (service) => {
  //   setSelectedService(service);
  //   setIsViewingService(true);
  // };

  const handleViewDetails = (index) => {
    const addonserviceData = index;

    // Store data in local storage
    localStorage.setItem("addonservice", JSON.stringify(addonserviceData));

    // Open new tab
    const addonserviceWindow = window.open("/addonservice", "_blank");

    if (!addonserviceWindow) {
      alert(
        "Please allow pop-ups for this website to view addonservice details."
      );
    }
  };

  const handleBack = () => {
    setSelectedService(null);
    setIsViewingService(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAddOnServices = addOnServices.filter((service) => {
    return (
      (service.serviceId &&
        service.serviceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.status &&
        service.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.description &&
        service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalPagesC = Math.ceil(filteredAddOnServices.length / itemsPerPageC);

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
    filteredAddOnServices.length
  );
  const slicedHistoryC = filteredAddOnServices.slice(startIndexC, endIndexC);

  return (
    <div>
      <NavigationBar />

      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-screen-lg w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4">
            YOUR ADD-ON SERVICES
          </h2>
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          {isViewingService ? (
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              <button onClick={handleBack} className="text-blue-500 mb-2">
                Back
              </button>
              <p className="text-gray-600">
                Service ID: {selectedService.serviceId}
              </p>
              <p className="text-gray-600">Status: {selectedService.status}</p>
              <p className="text-gray-600">
                Timestamp:{" "}
                {new Date(selectedService.timestamp).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Description: {selectedService.description}
              </p>
              <h4 className="text-md font-semibold mt-4">Services:</h4>
              
              {Object.entries(selectedService.services).map(
                ([category, subServices], idx) => (
                  <div key={idx} className="mb-2">
                    <h5 className="text-sm font-semibold mt-2">{category}</h5>
                    <ul>
                      {subServices.map((subService, sIdx) => (
                        <li key={sIdx} className="text-sm text-gray-600 ml-4">
                          {subService}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            slicedHistoryC
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 mb-4"
              >
                <p className="text-gray-600">Service ID: {service.serviceId}</p>
                <p className="text-gray-600">Status: {service.status}</p>
                <p className="text-gray-600">
                  Timestamp: {new Date(service.timestamp).toLocaleString()}
                </p>
                <p className="text-gray-600 overflow-auto break-words">
                  Description: {service.description}
                </p>
                <button
                  onClick={() => handleViewDetails(service)}
                  className="text-blue-500 mt-2"
                >
                  View Details
                </button>
              </div>
            ))
          )}
          <ul className="pagination flex justify-center items-center my-4">
            <li className={`page-item ${currentPageC === 1 ? "disabled" : ""}`}>
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

export default ViewAddOnServices;
