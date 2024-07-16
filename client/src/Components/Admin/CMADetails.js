import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const CMADetailsInNewTab = () => {
  const [cmaData, setCMAReturnData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("CMAData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCMAReturnData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/previewCMApreparation/${filename}`,
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
      console.error("Error previewing CMA:", error);
    }
  };
  //   const handleFieldChange = (field) => {
  //     setSelectedField(field);
  //   };

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/user/downloadCMApreparation/${filename}`,
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
      console.error("Error downloading CMA:", error);
    }
  };
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">CMA Details</h1>
        {cmaData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-lg mb-4">
              <strong>Company Name:</strong> {cmaData.company}
            </p>
            <p className="text-lg mb-4">
              <strong>CMA Preparation Type:</strong>{" "}
              {cmaData.cmaPreparationType}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Description:</strong> {cmaData.description}
            </p>
            <p className="text-lg mb-4 overflow-auto break-words">
              <strong>Remarks:</strong> {cmaData.remarks}
            </p>
            <p className="text-lg mb-4">
              <strong>Filename:</strong>{" "}
              {cmaData.files[0].filename.split("_").slice(1).join("_")}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Name:</strong> {cmaData.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Uploader Email:</strong> {cmaData.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Role:</strong> {cmaData.role}
            </p>
            <div className="flex items-center mt-8">
              {cmaData.files[0].filename.slice(-3).toLowerCase() === "pdf" && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                  onClick={() => handlePreview(cmaData.files[0].filename)}
                >
                  Preview
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                onClick={() => handleDownload(cmaData.files[0].filename)}
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg">No CMA data found.</p>
        )}
      </div>
    </div>
  );
};

export default CMADetailsInNewTab;
