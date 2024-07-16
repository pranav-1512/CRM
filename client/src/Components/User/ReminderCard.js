import React, { useState } from "react";
import axios from "axios";

const ReminderCard = ({ reminder }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/downloadreminder/${filename}`,
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

  const handlePreview = async (fileId, filename) => {
    try {
      setLoadingPreview(true);

      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/previewreminder/${filename}`,
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
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div className="bg-white p-4 my-4 rounded shadow-md">
      <h3 className="text-lg font-semibold">{reminder.title}</h3>
      <p className="overflow-auto break-words">{reminder.description}</p>

      {showDetails && (
        <div className="mt-2">
          <p>
            <strong>Files:</strong>
          </p>
          <ul>
            {reminder.files &&
              reminder.files.map((file, fileIndex) => (
                <li key={fileIndex} className="flex items-center">
                  <strong className="mr-2">Filename:</strong>
                  {file.filename}
                  <button
                    className="ml-2 text-blue-500 underline"
                    onClick={() => handleDownload(file.fileId, file.filename)}
                  >
                    Download
                  </button>
                  {file.filename &&
                    file.filename.slice(-3).toLowerCase() === "pdf" && (
                      <button
                        className="ml-2 text-blue-500 underline"
                        onClick={() =>
                          handlePreview(file.fileId, file.filename)
                        }
                      >
                        {loadingPreview ? "Loading Preview..." : "Preview"}
                      </button>
                    )}
                </li>
              ))}
          </ul>
          <p>
            <strong>Name:</strong> {reminder.name}
          </p>
          <p>
            <strong>Time:</strong> {reminder.timestamp}
          </p>
          {/* Add additional details as needed */}
        </div>
      )}

      <button
        className="mt-2 text-blue-500 underline cursor-pointer"
        onClick={toggleDetails}
      >
        {showDetails ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ReminderCard;
