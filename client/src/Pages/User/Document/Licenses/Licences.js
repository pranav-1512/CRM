import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../../NavigationBar/NavigationBar";
const UserLicenses = () => {
  let navigate = useNavigate();

  const [Licenses, setLicenses] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState({});
  const [selectedLicenses, setSelectedLicenses] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyNames, setCompanyNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  let isMounted = true;
  const [showAlert, setShowAlert] = useState(false);
  const [alertShown, setAlertShown] = useState(false); // Flag to track if alert is already shown
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  useEffect(() => {
    fetchLicenses();
    fetchCompanyNames();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchLicenses = async () => {
    isMounted = true;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/document/license/getAllLicenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setLicenses(response.data);
      setFilteredLicenses(response.data);
    } catch (error) {
      if (
        isMounted &&
        error.response &&
        error.response.status === 500 &&
        !alertShown
      ) {
        setShowAlert(true);
        setAlertShown(true); // Set flag to true once alert is shown
        alert("Session expired. Please login again.");
        navigate("/");
      }
      console.error("Error fetching GST Returns:", error);
    }
  };

  const fetchCompanyNames = async () => {
    isMounted = true;
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/company/getCompanyNameOnlyDetails",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setCompanyNames(response.data);
    } catch (error) {
      if (
        isMounted &&
        error.response &&
        error.response.status === 500 &&
        !alertShown
      ) {
        setShowAlert(true);
        setAlertShown(true); // Set flag to true once alert is shown
        alert("Session expired. Please login again.");
        navigate("/");
      }
      console.error("Error fetching company names:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      setLoadingDownload({ ...loadingDownload, [filename]: true });
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/license/downloadLicense/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
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
    } finally {
      setLoadingDownload({ ...loadingDownload, [filename]: false });
    }
  };

  const handlePreview = async (filename) => {
    try {
      setLoadingPreview({ ...loadingPreview, [filename]: true });

      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/license/previewLicense/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    } finally {
      setLoadingPreview({ ...loadingPreview, [filename]: false });
    }
  };

  const handleViewDetails = (index) => {
    const LicensesData = index;

    // Store data in local storage
    localStorage.setItem("LicenseData", JSON.stringify(LicensesData));

    // Open new tab
    const LicenseWindow = window.open("/license", "_blank");

    if (!LicenseWindow) {
      alert("Please allow pop-ups for this website to view License details.");
    }
  };

  const handleCloseDetails = () => {
    setSelectedLicenses(null);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    filterLicenses(event.target.value);
  };

  const filterLicenses = (company) => {
    if (company === "") {
      setFilteredLicenses(Licenses);
    } else {
      const filtered = Licenses.filter(
        (License) => License.company === company
      );
      setFilteredLicenses(filtered);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = Licenses.filter((rocFiling) => {
      return (
        rocFiling.files[0].filename
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        rocFiling.description
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        rocFiling.remarks
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        rocFiling.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setFilteredLicenses(filtered);
  };

  const extractFilenameAfterUnderscore = (filename) => {
    const parts = filename.split("_");
    return parts.length > 1 ? parts.slice(1).join("_") : filename;
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLicenses
    ? filteredLicenses.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPagesC = Math.ceil(filteredLicenses.length / itemsPerPageC);

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
    filteredLicenses.length
  );
  const slicedHistoryC = filteredLicenses.slice(startIndexC, endIndexC);

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="container mx-5 pt-5">
        <p className="font-bold text-3xl text-blue-500 mb-10 mx-5">
          LICENSE LIST{" "}
        </p>

        {/* Dropdown for selecting companies */}
        {selectedLicenses ? (
          <div className="my-10 w-full">
            <button
              onClick={handleCloseDetails}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-5 mx-10"
            >
              Back
            </button>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-11/12 lg:w-11/12  xl:w-11/12  mx-auto">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-400 mb-3">
                  License Details
                </h3>
                <p>
                  <strong className="text-gray-600">Filename:</strong>
                  {selectedLicenses.files[0].filename}
                </p>
                <p>
                  <strong className="text-gray-600">Description:</strong>
                  {selectedLicenses.description}
                </p>
                <p>
                  <strong className="text-gray-600">Remarks:</strong>
                  {selectedLicenses.remarks}
                </p>
                <p>
                  <strong className="text-gray-600">
                    Name of the Uploader:
                  </strong>
                  {selectedLicenses.name}
                </p>
                <p>
                  <strong className="text-gray-600">License Type:</strong>{" "}
                  {selectedLicenses.licenseType}
                </p>
                <p>
                  <strong className="text-gray-600">
                    Email of the uploader:
                  </strong>{" "}
                  {selectedLicenses.email}
                </p>
                <p>
                  <strong className="text-gray-600">Role:</strong>{" "}
                  {selectedLicenses.role}
                </p>
                <div className="flex items-center mt-4 flex-wrap">
                  {selectedLicenses.files[0].filename
                    .slice(-3)
                    .toLowerCase() === "pdf" && (
                    <button
                      onClick={() =>
                        handlePreview(selectedLicenses.files[0].filename)
                      }
                      disabled={
                        loadingPreview[selectedLicenses.files[0].filename] ||
                        !selectedLicenses.files[0].filename.endsWith(".pdf")
                      }
                      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    >
                      {loadingPreview[selectedLicenses.files[0].filename]
                        ? "Loading Preview..."
                        : "Preview"}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleDownload(selectedLicenses.files[0].filename)
                    }
                    disabled={
                      loadingDownload[selectedLicenses.files[0].filename]
                    }
                    className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                  >
                    {loadingDownload[selectedLicenses.files[0].filename]
                      ? "Downloading..."
                      : "Download"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 mx-5">
            <label className="block mb-2 ">
              <p className="text-xl text-gray-600">Select Company:</p>
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Companies</option>
                {companyNames.map((companyName) => (
                  <option key={companyName} value={companyName}>
                    {companyName}
                  </option>
                ))}
              </select>
            </label>

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 mt-4 mb-2 focus:outline-none focus:border-blue-500"
              placeholder="Search..."
            />
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border bg-gray-200 px-4 py-2">Sno</th>
                    <th className="border bg-gray-200 px-4 py-2">
                      Name of the File
                    </th>
                    <th className="border bg-gray-200 px-4 py-2">
                      Description
                    </th>
                    <th className="border bg-gray-200 px-4 py-2">Remarks</th>
                    <th className="border bg-gray-200 px-4 py-2">
                      Name of the Uploader
                    </th>
                    <th className="border bg-gray-200 px-4 py-2">Preview</th>
                    <th className="border bg-gray-200 px-4 py-2">Download</th>
                    <th className="border bg-gray-200 px-4 py-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {slicedHistoryC.length > 0 ? (
                    slicedHistoryC.map((Licenses, index) => (
                      <tr key={Licenses._id}>
                        <td className="border px-4 py-2">
                          {filteredLicenses.length - startIndexC - index}
                        </td>
                        <td className="border px-4 py-2">
                          {truncateText(
                            extractFilenameAfterUnderscore(
                              Licenses.files[0].filename
                            ),
                            20
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {truncateText(Licenses.description, 20)}
                        </td>
                        <td className="border px-4 py-2">
                          {truncateText(Licenses.remarks, 20)}
                        </td>
                        <td className="border px-4 py-2">
                          {truncateText(Licenses.name, 20)}
                        </td>
                        <td className="border px-4 py-2">
                          {Licenses.files[0].filename
                            .slice(-3)
                            .toLowerCase() === "pdf" && (
                            <button
                              onClick={() =>
                                handlePreview(Licenses.files[0].filename)
                              }
                              disabled={
                                loadingPreview[Licenses.files[0].filename]
                              }
                              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            >
                              {loadingPreview[Licenses.files[0].filename]
                                ? "Loading Preview..."
                                : "Preview"}
                            </button>
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() =>
                              handleDownload(Licenses.files[0].filename)
                            }
                            disabled={
                              loadingDownload[Licenses.files[0].filename]
                            }
                            className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                          >
                            {loadingDownload[Licenses.files[0].filename]
                              ? "Downloading..."
                              : "Download"}
                          </button>
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => handleViewDetails(Licenses)}
                            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="border px-4 py-2 text-center">
                        No Licenses available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        )}
      </div>
    </div>
  );
};

export default UserLicenses;
