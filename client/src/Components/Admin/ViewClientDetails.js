import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const ClientDetailsInNewTab = () => {
  const [clientData, setClientData] = useState(null);
  const [clientCData, setClientCData] = useState(null);
  const [showMoreMap, setShowMoreMap] = useState({});

  useEffect(() => {
    const storedClients = localStorage.getItem("viewclient");

    if (storedClients) {
      const parsedClients = JSON.parse(storedClients);
      setClientData(parsedClients[0]); // Set client data from the first index

      if (parsedClients.length > 1) {
        setClientCData(parsedClients.slice(1)); // Set company data from the remaining indices
      } else {
        setClientCData([]); // Set an empty array for company data
      }
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/previewCompanyFile/${filename}`,
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
        `https://sstaxmentors-server.vercel.app/user/downloadCompanyFile/${filename}`,
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
    const selectedTypes = Object.entries(companyType)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    return selectedTypes.length > 0
      ? selectedTypes.join(", ")
      : "Not specified";
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-semibold mb-5" style={{ color: "#0b5afc" }}>
          Client Details:
        </h1>
        {clientData && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-6 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p class="mb-2 text-lg">
                    <strong>First Name:</strong> {clientData.firstname}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Last Name:</strong> {clientData.lastname}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Date of Birth:</strong> {clientData.DOB}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Address:</strong> {clientData.address}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Street Name:</strong> {clientData.streetname}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>City:</strong> {clientData.city}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Is Verified:</strong>{" "}
                    {clientData.isverified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p class="mb-2 text-lg">
                    <strong>Landmark:</strong> {clientData.landmark}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>State:</strong> {clientData.state}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Company Name:</strong> {clientData.companyname}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Country:</strong> {clientData.country}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Email:</strong> {clientData.email}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Phone Number:</strong> {clientData.Phone_number}
                  </p>
                  <p class="mb-2 text-lg">
                    <strong>Status:</strong> {clientData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {clientCData && clientCData.length > 0 && (
          <div>
            <h1
              className="text-3xl font-semibold mb-5"
              style={{ color: "#0b5afc" }}
            >
              Company Details:
            </h1>
            {clientCData.map((company, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg shadow-md p-6 md:p-8 mb-4"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {company.companyName || "Company Name Not specified"}
                </h3>
                <p class="mb-2 text-lg">{`Company Type: ${getCompanyType(
                  company.companyType
                )}`}</p>
                <p class="mb-2 text-lg">{`Address: ${getAddress(
                  company.address
                )}`}</p>
                <p class="mb-2 text-lg">{`Office Number: ${
                  company.officeNumber || "Not specified"
                }`}</p>

                {/* Display subInputs */}
                {showMoreMap[idx] ? (
                  <>
                    {company.subInputValues &&
                      Object.entries(company.subInputValues).map(
                        ([subInputName, subInputData]) => (
                          <div key={subInputName} className="mt-4">
                            <p className="font-semibold text-lg">{`SubInputName: ${subInputName}`}</p>
                            {Object.entries(subInputData).map(
                              ([key, value]) =>
                                typeof value === "object" &&
                                "value" in value && (
                                  <p
                                    key={key}
                                    className="ml-4 text-lg"
                                  >{`${value.value}`}</p>
                                )
                            )}
                          </div>
                        )
                      )}

                    <div className="mt-6">
                      <div className="border-t border-gray-300 py-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                          Document Files:
                        </h4>
                        {company.documentFiles.map((file, index) => (
                          <div
                            key={index}
                            className="mt-2 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-gray-500 font-semibold text-md mr-2 text-lg">
                                Filename:{" "}
                              </span>
                              <span>{file.filename}</span>
                            </div>
                            <div>
                              {file.type === "application/pdf" && (
                                <button
                                  onClick={() => handlePreview(file.filename)}
                                  className="mr-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all duration-300"
                                >
                                  Preview
                                </button>
                              )}
                              <button
                                onClick={() => handleDownload(file.filename)}
                                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded transition-all duration-300"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="border-t border-gray-300 py-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                          Company Type Files:
                        </h4>
                        {company.companyTypeFiles.map((file, index) => (
                          <div
                            key={index}
                            className="mt-2 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-gray-500 font-semibold text-md mr-2 text-lg">
                                Filename:{" "}
                              </span>
                              <span>{file.filename}</span>
                            </div>
                            <div>
                              {file.type === "application/pdf" && (
                                <button
                                  onClick={() => handlePreview(file.filename)}
                                  className="mr-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all duration-300"
                                >
                                  Preview
                                </button>
                              )}
                              <button
                                onClick={() => handleDownload(file.filename)}
                                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded transition-all duration-300"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setShowMoreMap((prevState) => ({
                          ...prevState,
                          [idx]: false,
                        }))
                      }
                      className="text-blue-500 mt-4 cursor-pointer"
                    >
                      Show Less
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      setShowMoreMap((prevState) => ({
                        ...prevState,
                        [idx]: true,
                      }))
                    }
                    className="text-blue-500 mt-4 cursor-pointer"
                  >
                    Show More
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailsInNewTab;
