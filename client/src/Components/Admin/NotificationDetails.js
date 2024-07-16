import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const NotificationDetailsInNewTab = () => {
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("notification");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setNotificationData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/previewnotification",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            filename: filename,
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
      const response = await axios.get("https://sstaxmentors-server.vercel.app/admin/download", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          filename: filename,
        },
        responseType: "blob", // Set response type to blob
      });

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
        <h1 className="text-3xl font-semibold mb-8">Notification Details</h1>
        {notificationData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div>
              <h3 className="text-2xl font-medium mb-2 text-black-600 overflow-auto break-words">
                {notificationData.title}
              </h3>
              <p className="text-sm text-gray-700 mb-2 overflow-auto break-words">
                {notificationData.description}
              </p>
              {notificationData.files && notificationData.files.length > 0 && (
                <p className="text-2xl font-medium mb-2 text-black-100">
                  {notificationData.files[0].filename}
                </p>
              )}
              
            </div>
            <div className="flex items-center mt-8">
              {notificationData.files && notificationData.files.length > 0 ? (
                <>
                  {notificationData.files[0].filename
                    .slice(-3)
                    .toLowerCase() === "pdf" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                      onClick={() =>
                        handlePreview(notificationData.files[0].filename)
                      }
                    >
                      Preview
                    </button>
                  )}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                    onClick={() =>
                      handleDownload(notificationData.files[0].filename)
                    }
                  >
                    Download
                  </button>
                </>
              ) : (
                <p className="font-semibold">No file available.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-lg">No Notification data found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDetailsInNewTab;
