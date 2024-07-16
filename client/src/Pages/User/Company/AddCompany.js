import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";

function AddCompany() {
  let isMounted = true;
  let navigate = useNavigate();
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
      // console.error('Error fetching company details:', err.response);
      setError({ fetchCompanyDetails: "Error fetching company details" });
      if (err.response && err.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
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
    // setSelectedClient('');
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
    const formData = new FormData();
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
      setLoading(true)

      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/user/company/addcompany",
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
    } catch (error) {
      message.error("Error! Try again later");
      // console.error('Error uploading files:', error);
    } finally {
      setLoading(false)
    }
  };

  return (
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
  );
}

export default AddCompany;
