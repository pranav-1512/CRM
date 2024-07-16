import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const GSTReturnDetailsInNewTab = () => {
  const [gstReturnData, setGSTReturnData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("GSTReturnsData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setGSTReturnData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/previewGSTReturns/${filename}`,
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
    }
  };

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/downloadGSTReturns/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data]);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
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
        <h1 className="text-3xl font-semibold mb-8">GST Return Details</h1>
        {gstReturnData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-lg mb-4">
              <strong>Company Name:</strong> {gstReturnData.selectedClientGroup}
            </p>
            <p className="text-lg mb-4">
              <strong>GST Returns Type:</strong>{" "}
              {gstReturnData.selectedReturnType}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Description:</strong> {gstReturnData.description}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Remarks:</strong> {gstReturnData.remarks}
            </p>
            <p className="text-lg mb-4">
              <strong>Filename:</strong>{" "}
              {gstReturnData.files[0].filename.split("_").slice(1).join("_")}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Name:</strong> {gstReturnData.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Email:</strong> {gstReturnData.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Role:</strong> {gstReturnData.role}
            </p>
            <div className="flex items-center mt-8">
              {gstReturnData.files[0].filename.slice(-3).toLowerCase() ===
                "pdf" && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                  onClick={() => handlePreview(gstReturnData.files[0].filename)}
                >
                  Preview
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                onClick={() => handleDownload(gstReturnData.files[0].filename)}
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg">No GST Return data found.</p>
        )}
      </div>
    </div>
  );
};

export default GSTReturnDetailsInNewTab;
