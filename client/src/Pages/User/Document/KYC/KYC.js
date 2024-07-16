import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import NavigationBar from "../../NavigationBar/NavigationBar";

const KYC = () => {
  let isMounted;
  let navigate = useNavigate();
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [electricityBillFile, setElectricityBillFile] = useState(null);
  const [bankPassbookFile, setBankPassbookFile] = useState(null);

  const [aadharFileInfo, setAadharFileInfo] = useState(null);
  const [panFileInfo, setPanFileInfo] = useState(null);
  const [electricityBillFileInfo, setElectricityBillFileInfo] = useState(null);
  const [bankPassbookFileInfo, setBankPassbookFileInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [documentToRemove, setDocumentToRemove] = useState(null);
  // console.log("🚀 ~ KYC ~ documentToRemove:", documentToRemove)

  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    fetchFileInfo("aadhar", setAadharFileInfo);
    fetchFileInfo("pan", setPanFileInfo);
    fetchFileInfo("electricityBill", setElectricityBillFileInfo);
    fetchFileInfo("bankPassbook", setBankPassbookFileInfo);
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  let isAlertShown = false;

  const fetchFileInfo = async (category, setFileInfo) => {
    isMounted = true;
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/kyc/download/${category}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setFileInfo(response.data);
    } catch (error) {
      console.error("Error fetching file information:", error);
      console.log("error", error.response);
      console.log("ismounted", isMounted);
      if (
        isMounted &&
        error.response &&
        error.response.status === 500 &&
        !isAlertShown
      ) {
        // If the response status is 401, display an alert and redirect to login page
        isAlertShown = true;
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  const handleFileChange = (category, file) => {
    switch (category) {
      case "aadhar":
        setAadharFile(file);
        break;
      case "pan":
        setPanFile(file);
        break;
      case "electricityBill":
        setElectricityBillFile(file);
        break;
      case "bankPassbook":
        setBankPassbookFile(file);
        break;
      default:
        break;
    }
  };

  const handleUpload = async (category) => {
    try {
      setLoading(true);

      const authToken = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", getCategoryFile(category));

      await axios.post(
        `https://sstaxmentors-server.vercel.app/user/upload/${category}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`File uploaded successfully for category: ${category}`);
      fetchFileInfo(category, setFileInfoState(category));
      message.success("file uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error here, e.g., display an error message to the user
      message.error("file not submitted.please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (category) => {
    try {
      const fileInfo = getFileInfo(category);

      if (!fileInfo || !fileInfo.status) {
        console.error("File not found or status is false.");
        return;
      }

      const authToken = localStorage.getItem("token");
      const filename = fileInfo.kycSchema.filename;
      console.log("🚀 ~ handlePreview ~ filename:", filename);

      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/previewkyc/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleDownload = async (category) => {
    try {
      const fileInfo = getFileInfo(category);

      if (!fileInfo || !fileInfo.status) {
        console.error("File not found or status is false.");
        return;
      }

      const authToken = localStorage.getItem("token");
      const filename = fileInfo.kycSchema.filename;

      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/document/kyc/downloadkyc/${filename}`,
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
    }
  };

  const handleEdit = (category) => {
    // Implement edit logic
    console.log(`Edit clicked for category: ${category}`);
  };

  const handleRemove = (category) => {
    setDocumentToRemove(category);
    setModalOpen(true);
  };

  const handleConfirmRemove = (confirmed) => {
    if (confirmed) {
      // Handle the actual removal logic here
      const authToken = localStorage.getItem("token");
      axios
        .delete(
          `https://sstaxmentors-server.vercel.app/user/document/kyc/remove/${documentToRemove}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          console.log(
            `File removed successfully for category: ${documentToRemove}`
          );
          // fetchFileInfo(documentToRemove, setFileInfoState(documentToRemove));
          // setDocumentToRemove(null);
          if (documentToRemove === "aadhar") {
            setAadharFileInfo(null);
          } else if (documentToRemove === "pan") {
            setPanFileInfo(null);
          } else if (documentToRemove === "electricityBill") {
            setElectricityBillFileInfo(null);
          } else if (documentToRemove === "bankPassbook") {
            setBankPassbookFileInfo(null);
          } else {
            console.log("nothing is found");
          }
        })
        .catch((error) => {
          console.error("Error removing file:", error);
        })
        .finally(() => {
          setModalOpen(false);
        });

      message.success("file deleted successfully!");
    } else {
      console.log("Removal canceled");
      setModalOpen(false);
      setDocumentToRemove(null);
      message.error("please try again later");
    }
  };

  const getCategoryFile = (category) => {
    switch (category) {
      case "aadhar":
        return aadharFile;
      case "pan":
        return panFile;
      case "electricityBill":
        return electricityBillFile;
      case "bankPassbook":
        return bankPassbookFile;
      default:
        return null;
    }
  };

  const getFileInfo = (category) => {
    switch (category) {
      case "aadhar":
        return aadharFileInfo;
      case "pan":
        return panFileInfo;
      case "electricityBill":
        return electricityBillFileInfo;
      case "bankPassbook":
        return bankPassbookFileInfo;
      default:
        return null;
    }
  };

  const setFileInfoState = (category) => {
    switch (category) {
      case "aadhar":
        return setAadharFileInfo;
      case "pan":
        return setPanFileInfo;
      case "electricityBill":
        return setElectricityBillFileInfo;
      case "bankPassbook":
        return setBankPassbookFileInfo;
      default:
        return null;
    }
  };

  const renderFileButtons = (category) => {
    const fileInfo = getFileInfo(category);

    if (!fileInfo) {
      // Render upload button if file info is not available
      return (
        <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(category, e.target.files[0])}
            className="mb-2"
          />
          <button
            id={`uploadButton_${category}`}
            onClick={() => handleUpload(category)}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Upload
          </button>
        </div>
      );
    }

    // Render buttons based on the status received from the backend
    const { status, kycSchema } = fileInfo;

    return (
      <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md ">
        <p className="mb-2">File Name: {kycSchema.filename}</p>
        {kycSchema.filename.slice(-3).toLowerCase() === "pdf" && (
          <button
            id={`previewButton_${category}`}
            onClick={() => handlePreview(category)}
            disabled={!status || loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Preview
          </button>
        )}
        <button
          id={`downloadButton_${category}`}
          onClick={() => handleDownload(category)}
          disabled={!status || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Download
        </button>
        {/* <button
          id={`editButton_${category}`}
          onClick={() => handleEdit(category)}
          disabled={!status || loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Edit
        </button> */}
        <button
          id={`removeButton_${category}`}
          onClick={() => handleRemove(category)}
          disabled={!status || loading}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div>
      {!modalOpen && <NavigationBar />}
      <hr></hr>
      <div className="p-4 mx-5gis">
        <p className="font-bold text-3xl text-blue-500 ml-4 mb-10">
          KYC DOCUMENTS
        </p>
        <div>
          <label className="block m-4 text-gray-700 text-lg ">
            Aadhar Card:
          </label>
          {renderFileButtons("aadhar")}
        </div>

        <div>
          <label className="block m-4 text-gray-700 text-lg">Pan Card:</label>
          {renderFileButtons("pan")}
        </div>

        <div>
          <label className="block m-4 text-gray-700 text-lg">
            Electricity Bill:
          </label>
          {renderFileButtons("electricityBill")}
        </div>

        <div>
          <label className="block m-4 text-gray-700 text-lg">
            Bank Passbook:
          </label>
          {renderFileButtons("bankPassbook")}
        </div>

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-1/3 mx-auto p-6 rounded shadow-lg z-20">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-bold">Confirm Removal</p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <svg
                      className="fill-current h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-700">
                  Are you sure you want to remove the document:{" "}
                  {documentToRemove}?
                </p>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => handleConfirmRemove(true)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirmRemove(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;
