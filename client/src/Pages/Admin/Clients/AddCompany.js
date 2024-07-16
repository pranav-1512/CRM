import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const AddCompany = () => {
  const [clients, setClients] = useState([]);

  const [filteredClientData, setFilteredClientData] = useState([]);

  const [selectedClient, setSelectedClient] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);
//   let isMounted = true;
//   let navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [companyDetails, setCompanyDetails] = useState([]);
  const [companyType, setCompanyType] = useState({
    soleProprietorship: false,
    partnershipFirm: false,
    limitedLiabilityPartnerships: false,
    privateLimitedCompany: false,
    publicLimitedCompany: false,
    onePersonCompany: false,
  });
  const [companyTypeFiles, setCompanyTypeFiles] = useState(null);
  const [documentFiles, setDocumentFiles] = useState(null);
  const [address, setAddress] = useState({
    streetName: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    landmark: "",
  });
  const [officeNumber, setOfficeNumber] = useState("");
  const [subInputValues, setSubInputValues] = useState({});
  const [error, setError] = useState({});

  const formRef = useRef(null); // Create a ref for the form

  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/CompanyDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setCompanyDetails(response.data);
    } catch (err) {
      setError({ fetchCompanyDetails: "Error fetching company details" });
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCompanyType((prevCompanyType) => ({
      ...prevCompanyType,
      [name]: checked,
    }));
  };

  const handleCheckboxReset = () => {
    const resetCompanyType = Object.keys(companyType).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setCompanyType(resetCompanyType);
  };


  const handleCompanyTypeFileUpload = (event) => {
    setCompanyTypeFiles(event.target.files);
  };

  const handleDocumentFileUpload = (event) => {
    setDocumentFiles(event.target.files);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleInputChange = (mainName, subInput, value) => {
    setSubInputValues((prevValues) => ({
      ...prevValues,
      [mainName]: {
        ...(prevValues[mainName] || {}),
        [subInput]: { value },
      },
    }));
  };

  const handleOfficeNumberChange = (event) => {
    setOfficeNumber(event.target.value);
  };


  const handleReset = () => {
    setSelectedClient('');
    setCompanyName('');
    // setCompanyType({});
    setAddress({});
    setOfficeNumber('');
    setSubInputValues([]);
    setCompanyTypeFiles(null);
    setDocumentFiles(null);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);  // Show the loader

    const formData = new FormData();
    formData.append("client",selectedClient)
    formData.append("companyName", companyName);
    formData.append("companyType", JSON.stringify(companyType));
    formData.append("address", JSON.stringify(address));
    formData.append("officeNumber", officeNumber);
    formData.append("subInputValues", JSON.stringify(subInputValues));

    if (companyTypeFiles) {
      Array.from(companyTypeFiles).forEach((file) => {
        formData.append("companyTypeFiles", file);
      });
    }

    if (documentFiles) {
      Array.from(documentFiles).forEach((file) => {
        formData.append("documentFiles", file);
      });
    }

    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/client/addcompany",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Successfully registered new company");
      formRef.current.reset();
      handleReset();
      handleCheckboxReset(); // Reset the checkbox state
      setShowForm(false);
    } catch (error) {
      message.error("Error! Try again later");
    } finally {
      setLoading(false);  // Hide the loader
     
    }
  
  };

  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15); // You can change this value as needed

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

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

    // if (selectedOption) {
    //   filteredClients = filteredClients.filter(client => client.typeOfC.toLowerCase() === selectedOption);
    // }

    setFilteredClientData(filteredClients);
  };


  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(startIndexC + itemsPerPageC, filteredClientData.length);
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

  const paginateClients = (pageNumber) => setCurrentPageClient(pageNumber);

  const indexOfLastClient = currentPageClient * itemsPerPageClient;
  const indexOfFirstClient = indexOfLastClient - itemsPerPageClient;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const handleViewClient = async (client) => {
    setSelectedClient(client.email);
    setShowForm(true);
   
  };

  return (
    <div className="">
      <div className="">
        {showForm ? (
          <div>
            <NavigationBar />

            <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-500 mb-10 text-center">
            COMPANY REGISTRATION FORM
          </h2>
          <form className="mt-4" ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block font-regular text-lg mb-3 text-gray-500"
              >
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter company name"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-regular text-lg mb-3 text-gray-500">
                Company Type:
              </label>
              {Object.entries(companyType).map(([type, checked]) => (
                <label key={type} className=" items-center">
                  <div>
                    <input
                      type="checkbox"
                      name={type}
                      checked={checked}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-3 w-3 text-blue-600"
                    />
                    <span className="ml-2">{type}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label
                htmlFor="companyTypeFiles"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Upload Company Type Documents:
              </label>
              <input
                type="file"
                id="companyTypeFiles"
                onChange={handleCompanyTypeFileUpload}
                multiple
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="streetName"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Street Name:
              </label>
              <input
                type="text"
                id="streetName"
                placeholder="Enter street name"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="streetName"
                value={address.streetName}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="city"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                placeholder="Enter city"
                className="border  border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                State:
              </label>
              <input
                type="text"
                id="state"
                placeholder="Enter state"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="postalCode"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Postal Code:
              </label>
              <input
                type="text"
                id="postalCode"
                placeholder="Enter postal code"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="landmark"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Landmark:
              </label>
              <input
                type="text"
                id="landmark"
                placeholder="Enter landmark"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                name="landmark"
                value={address.landmark}
                onChange={handleAddressChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="officeNumber"
                className="block mb-3 font-regular text-lg text-gray-500"
              >
                Office Number:
              </label>
              <input
                type="text"
                id="officeNumber"
                placeholder="Enter office number"
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                value={officeNumber}
                onChange={handleOfficeNumberChange}
              />
            </div>
            <div className="mb-4">
              {companyDetails.map((mainName) => (
                <div key={mainName._id} className="mb-2">
                  <p className="font-normal text-lg mb-5 text-gray-500">
                    {mainName.mainName}:
                  </p>
                  {mainName.subInputs.map((subInput, index) => (
                    <div key={index} className="flex mb-2">
                      <div className="max-w-24 ml-6 ">{subInput}: </div>
                      <input
                        type="text"
                        value={
                          subInputValues[mainName.mainName]?.[subInput]
                            ?.value || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            mainName.mainName,
                            subInput,
                            e.target.value
                          )
                        }
                        className="border w-9/12 border-gray-300 px-3 py-2 ml-auto flex-shrink-0  rounded  focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 "
                        placeholder={`Enter ${subInput}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label
                htmlFor="documentFiles"
                className="flex font-regular text-lg my-6 text-gray-500"
              >
                Upload Documents Related to
                <span>&nbsp;</span>
                {companyDetails.map((mainName, index) => (
                  <div key={mainName._id}>
                    {index !== 0 && (
                      <span className="text-gray-500">&nbsp;</span>
                    )}
                    <span className="text-gray-500">
                      {mainName.mainName}
                      {index !== companyDetails.length - 1 ? "," : ":"}
                    </span>
                  </div>
                ))}
              </label>
              <input
                type="file"
                id="documentFiles"
                onChange={handleDocumentFileUpload}
                multiple
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <div className="flex justify-center items-center mt-10 mb-5">
              <button
                type="submit"
                className="flex justify-center items-center w-56 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                // onClick={handleSubmit}
              >
              {loading ? 'Loading...' : 'Submit'} 
              </button>
            </div>
          </form>
        </div>
      </div>
          </div>
        ) : (
          <div>
            <NavigationBar />
            <hr></hr>
            <div className="container mx-auto p-5 md:p-10">
              <p className="font-bold text-3xl  text-blue-500 mb-10">
                Add Company{" "}
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
export default AddCompany;
