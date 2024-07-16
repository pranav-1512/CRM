import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import "../../Custommodal.css";
import NavigationBar from "../../Pages/User/NavigationBar/NavigationBar";
const GSTRegistration = () => {
  let navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState("");
  const [file, setFile] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [companyNames, setCompanyNames] = useState([]);
  const [previousFile, setPreviousFile] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const [loader, setLoader] = useState(false)


  useEffect(() => {
    let isMounted = true;
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/getCompanyNameOnlyDetails",
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
        console.error("Error fetching company names:", error);
        if (isMounted && error.response && error.response.status === 500) {
          // If the response status is 401, display an alert and redirect to login page
          alert("Session expired. Please login again.");
          // window.location.href = '/'; // Change the URL accordingly
          navigate("/");
        }
      }
    };

    fetchCompanyNames();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      console.log("IN side")
      fetchData(selectedCompany);
    }
  }, [isFormSubmitted, selectedCompany]);

  useEffect(() => {
    if (isFormSubmitted && file) {
      setPreviousFile(file);
    }
  }, [isFormSubmitted, file]);

  const handleCompanyChange = (event) => {
    const newCompany = event.target.value;
    setSelectedCompany(newCompany);
    fetchData(newCompany); // Fetch data when a new company is selected
    setFile(null); // Reset file when company changes
  };

  const fetchData = async (companyName) => {
    if (!companyName) return; // Exit early if no company name is provided

    try {
      const token = localStorage.getItem("token");
      const url = `https://sstaxmentors-server.vercel.app/user/getgstdoc/${companyName}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { filename, fileId } = response.data;

      if (filename && fileId) {
        setFile({ name: filename, fileId });
        setPreviousFile({ name: filename, fileId });
        setFileExists(true);
      } else {
        setFile(null);
        setFileExists(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFile(null);
        setFileExists(false);
      } else {
        console.error("Error fetching file:", error);
      }
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePreview = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `https://sstaxmentors-server.vercel.app/user/previewGSTR/${file.name}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Check if the content-type of the response indicates a PDF
      const isPDF = response.headers["content-type"]
        .toLowerCase()
        .includes("pdf");
      // Show preview button only if the file is a PDF
      if (isPDF) {
        const blobResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });

        const blob = new Blob([blobResponse.data], {
          type: blobResponse.headers["content-type"],
        });

        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, "_blank");
      } else {
        console.log("File is not a PDF. Preview not supported.");
      }
    } catch (error) {
      console.error("Error handling preview:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `https://sstaxmentors-server.vercel.app/user/downloadGSTR/${file.name}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error handling download:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `https://sstaxmentors-server.vercel.app/user/deleteGSTR/${file.name}/${selectedCompany}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFile(null);
      message.success("File deleted successfully");
      setSelectedCompany("")
      setFileExists(false)
      setIsFormSubmitted(false);
      setIsModalVisible(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error handling delete:", error);
      message.error("File not deleted. Please try again");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoader(true)

      const dataForBackend = new FormData();
      dataForBackend.append("companyName", selectedCompany);
      dataForBackend.append("file", file);
      dataForBackend.append("timestamp", new Date().toISOString());

      const token = localStorage.getItem("token");
      const url = `https://sstaxmentors-server.vercel.app/user/gstregistration`;

      const response = await axios.post(url, dataForBackend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setIsFormSubmitted(true);
        setLoader(false)
        message.success("File submitted successfully");

      }
    } catch (error) {
      console.error("Error sending data to the backend:", error);
      message.error("File not sent. Please try again later");
    }
  };

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="p-4  mx-5">
        <p className="font-bold text-3xl text-blue-500 mb-10">
          GST REGISTRATION{" "}
        </p>
        <div className="mb-6">
          <label
            htmlFor="company"
            className="block text-lg font-medium text-gray-600 mb-2"
          >
            Select Company
          </label>
          <select
            id="company"
            name="company"
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" disabled hidden>
              Select a company
            </option>
            {companyNames.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {selectedCompany && (
          <>
            {fileExists ? (
              <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
                <p className="mb-2">
                  File Name: {previousFile && previousFile.name}
                </p>

                {file?.name.toLowerCase().endsWith(".pdf") && (
                  <button
                    onClick={handlePreview}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Preview
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Download
                </button>
                <button
                  onClick={() => setIsModalVisible(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-600"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white p-2 rounded-md mt-2"
                >

                  {loader ? "Loading..." : "Submit"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal for confirming document deletion */}
        <Modal
          title="Confirm Deletion"
          visible={isModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          okText="Confirm"
          cancelText="Cancel"
          className="custom-modal"
        >
          <p>Are you sure you want to delete the document?</p>
        </Modal>
      </div>
    </div>
  );
};

export default GSTRegistration;
