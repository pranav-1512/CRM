import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const ReminderDetailsInNewTab = () => {
  const [reminderData, setReminderData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("reminder");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setReminderData(parsedData);
    }
  }, []);

  const handlePreview = async (filename) => {
    try {
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
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/downloadreminder/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
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
        <h1 className="text-3xl font-semibold mb-8">Reminder Details</h1>
        {reminderData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div>
              <h3 className="text-2xl font-medium mb-2 text-black-600">
                {reminderData.title}
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                {reminderData.description}
              </p>
              {reminderData.files && reminderData.files.length > 0 ? (
                <p className="text-2xl font-medium mb-2 text-black-100">
                  {reminderData.files[0].filename}
                </p>
              ) : (
                <p className="font-semibold">No file available.</p>
              
              )}
            </div>
            {reminderData.files && reminderData.files.length > 0 && (
              <div className="flex items-center mt-8">
                {reminderData.files[0].filename.slice(-3).toLowerCase() ===
                  "pdf" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4"
                    onClick={() => handlePreview(reminderData.files[0].filename)}
                  >
                    Preview
                  </button>
                )}
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded"
                  onClick={() => handleDownload(reminderData.files[0].filename)}
                >
                  Download
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-lg">No Notification data found.</p>
        )}
      </div>
    </div>
  );
};

export default ReminderDetailsInNewTab;
