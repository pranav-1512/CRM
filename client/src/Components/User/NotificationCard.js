import React, { useState } from "react";
import axios from "axios";

const NotificationCard = ({ notification }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/download/${filename}`,
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
        `https://sstaxmentors-server.vercel.app/admin/previewnotification/${filename}`,
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
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              {notification.title}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {notification.description}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                className="text-blue-500 underline"
                onClick={toggleDetails}
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {showDetails && (
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {notification.files &&
                notification.files.map((file, fileIndex) => (
                  <tr key={fileIndex}>
                    <td className="border border-gray-300 px-4 py-2">
                      {file.filename}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-blue-500 underline"
                        onClick={() =>
                          handleDownload(file.fileId, file.filename)
                        }
                      >
                        Download
                      </button>
                    </td>
                    {file.filename &&
                      file.filename.slice(-3).toLowerCase() === "pdf" && (
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            className="text-blue-500 underline"
                            onClick={() =>
                              handlePreview(file.fileId, file.filename)
                            }
                          >
                            {loadingPreview ? "Loading Preview..." : "Preview"}
                          </button>
                        </td>
                      )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
