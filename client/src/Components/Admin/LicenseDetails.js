import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const LicenseDetailsInNewTab = () => {
  const [licenseData, setLicenseData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("LicenseData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLicenseData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/previewLicense/${filename}`,
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

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/downloadLicense/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

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

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">License Details</h1>
        {licenseData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-lg mb-4">
              <strong>Company Name:</strong> {licenseData.company}
            </p>
            <p className="text-lg mb-4">
              <strong>License Type:</strong> {licenseData.licenseType}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Description:</strong> {licenseData.description}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Remarks:</strong> {licenseData.remarks}
            </p>
            <p className="text-lg mb-4">
              <strong>Filename:</strong>{" "}
              {licenseData.files[0].filename.split("_").slice(1).join("_")}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Name:</strong> {licenseData.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Email:</strong> {licenseData.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Role:</strong> {licenseData.role}
            </p>
            <div className="flex items-center mt-8">
              {licenseData.files[0].filename.slice(-3).toLowerCase() ===
                "pdf" && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                  onClick={() => handlePreview(licenseData.files[0].filename)}
                >
                  Preview
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                onClick={() => handleDownload(licenseData.files[0].filename)}
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg">No License data found.</p>
        )}
      </div>
    </div>
  );
};

export default LicenseDetailsInNewTab;
