import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const GSTNoticeDetailsInNewTab = () => {
  const [gstNoticeData, setGSTNoticeData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("GSTNoticeData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setGSTNoticeData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/previewGSTNotice/${filename}`,
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
        `https://sstaxmentors-server.vercel.app/admin/downloadGSTNotice/${filename}`,
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
        <h1 className="text-3xl font-semibold mb-8">GST Notice Details</h1>
        {gstNoticeData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-lg mb-4">
              <strong>Company Name:</strong> {gstNoticeData.selectedClientGroup}
            </p>
            <p className="text-lg mb-4">
              <strong>Notice Type:</strong> {gstNoticeData.selectedNoticeType}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Description:</strong> {gstNoticeData.description}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Remarks:</strong> {gstNoticeData.remarks}
            </p>
            <p className="text-lg mb-4">
              <strong>Filename:</strong> {gstNoticeData.files[0].filename}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Name:</strong> {gstNoticeData.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Email:</strong> {gstNoticeData.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Role:</strong> {gstNoticeData.role}
            </p>
            <div className="flex items-center mt-8">
              {gstNoticeData.files[0].filename.slice(-3).toLowerCase() ===
                "pdf" && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                  onClick={() => handlePreview(gstNoticeData.files[0].filename)}
                >
                  Preview
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                onClick={() => handleDownload(gstNoticeData.files[0].filename)}
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg">No GST Notice data found.</p>
        )}
      </div>
    </div>
  );
};

export default GSTNoticeDetailsInNewTab;
