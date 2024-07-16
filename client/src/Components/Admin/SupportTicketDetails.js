// SupportTicketDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";

const SupportTicketDetails = () => {
  //console.log({ticketId});

  const { ticketId } = useParams();
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/getSupportTicketUsingTicketid/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicketDetails(response.data[0]);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const handlePreview = async (fileId) => {
    try {
      setLoadingPreview(true);

      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/previewSupportTicketFile/${fileId}`,
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

  const handleDownload = async (fileId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/downloadSupportTicketFile/${fileId}`,
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
      link.download = fileId;
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleResolve = async () => {
    try {
      const token = localStorage.getItem("token");
      // Update ticket status to resolved
      await axios.patch(
        `https://sstaxmentors-server.vercel.app/admin/resolveSupportTicket/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh ticket details after resolving
      fetchTicketDetails();
    } catch (error) {
      console.error("Error resolving support ticket:", error);
    }
  };

  if (!ticketDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Support Ticket Details</h2>

        <div>
          <p>Ticket ID: {ticketDetails.ticketId}</p>
          <p>Question Type: {ticketDetails.questionType}</p>
          <p>Client Name: {ticketDetails.clientName}</p>
          <p>Status: {ticketDetails.status}</p>
          <p>Timestamp: {new Date(ticketDetails.timestamp).toLocaleString()}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Issue Message:</h3>
          <p>{ticketDetails.issueMessage}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Files:</h3>
          <ul>
            {ticketDetails.files &&
              ticketDetails.files.map((file) => (
                <li key={file.fileId}>
                  {file.filename}{" "}
                  <button onClick={() => handlePreview(file.filename)}>
                    Preview
                  </button>{" "}
                  <button onClick={() => handleDownload(file.filename)}>
                    Download
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {ticketDetails.status !== "resolved" && (
          <div className="mt-4">
            <button
              onClick={handleResolve}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Resolve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketDetails;
