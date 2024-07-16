import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const ITDetailsInNewTab = () => {
  const [itReturnData, setITReturnData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("itReturnData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setITReturnData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/previewITReturns/${filename}`,
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
        `https://sstaxmentors-server.vercel.app/admin/downloadITReturns/${filename}`,
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

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">IT Return Details</h1>
        {itReturnData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-lg mb-4">
              <strong>Company Name:</strong> {itReturnData.selectedClientGroup}
            </p>
            <p className="text-lg mb-4">
              <strong>IT Return Type:</strong> {itReturnData.selectedReturnType}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Description:</strong> {itReturnData.description}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Remarks:</strong> {itReturnData.remarks}
            </p>
            <p className="text-lg mb-4">
              <strong>Filename:</strong>{" "}
              {itReturnData.files[0].filename.split("_").slice(1).join("_")}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Name:</strong> {itReturnData.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Email:</strong> {itReturnData.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Role:</strong> {itReturnData.role}
            </p>
            <div className="flex items-center mt-8">
              {itReturnData.files[0].filename.slice(-3).toLowerCase() ===
                "pdf" && (
                <button
                  onClick={() => handlePreview(itReturnData.files[0].filename)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                >
                  Preview
                </button>
              )}
              <button
                onClick={() => handleDownload(itReturnData.files[0].filename)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg">No IT Return data found.</p>
        )}
      </div>
    </div>
  );
};

export default ITDetailsInNewTab;
