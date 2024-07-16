import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AddOnServiceDetailsInNewTab = () => {
  const [addOnServiceData, setAddOnServiceData] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  const navigate = useNavigate()

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("addonservice");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAddOnServiceData(parsedData);
    }
  }, []);

  const handleSolve = async () => {
    try {
      console.log(addOnServiceData.serviceId);
      const authToken = localStorage.getItem("token");
      const userRole  = localStorage.getItem("role");
      setLoading(true)

      const response =await axios.post(
        `https://sstaxmentors-server.vercel.app/admin/solveService`,
        {
          serviceId: addOnServiceData.serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setLoading(false);

      if (response) {
        if (userRole === "admin") {
          // navigate("/admin/admindashboard/AddOnServices");
          window.close(); // Close current tab
          window.opener.location.href = "/admin/admindashboard/AddOnServices"; // Navigate previous tab to new route
        } else if (userRole === "employee") {
          // navigate("/employee/employeedashboard/AddOnServices");
          window.close(); // Close current tab
          window.opener.location.href = "/employee/employeedashboard/AddOnServices"; // Navigate previous tab to new route
        } else {
          message.error("Unknown user role");
        }
        message.success("Solved successfully");
      } else {
        message.error("Failed to solve");
      }
      // Refresh the current page
      // window.location.reload();
    } catch (error) {
      console.error("Error handling solve:", error);
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">Add-On Service Details</h1>
        {addOnServiceData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <span className="text-gray-600">Service ID: </span>
            <span>{addOnServiceData.serviceId}</span>
            <p></p>
            <span className="text-gray-600">Status:</span>
            <span> {addOnServiceData.status}</span>
            <p></p>
            <span className="text-gray-600">Timestamp:</span>
            <span>{new Date(addOnServiceData.timestamp).toLocaleString()}</span>
            <p></p>
            <span className="text-gray-600">Description:1</span>
            <span className= "overflow-auto break-words">{addOnServiceData.description}</span>
            <h4 className="text-md font-semibold mt-4">Services:</h4>
            {Object.entries(addOnServiceData.services).map(([category, subServices], idx) => (
              <div key={idx} className="mb-2">
                <h5 className="text-sm font-semibold mt-2">{category}</h5>
                {Array.isArray(subServices) ? (
                  <ul>
                    {subServices.map((subService, sIdx) => (
                      <li key={sIdx} className="text-sm text-gray-600 ml-4">
                        {subService}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 ml-4">No sub-services available.</p>
                )}
              </div>
            ))}
            <div className="flex items-center mt-8">
              {localStorage.getItem('role')!=='user' && addOnServiceData.status !== "resolved" && (
                <div className="mt-4">
                  <button
                    onClick={handleSolve}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                  {loading ? "Please wait.."  : "Resolve" }
                  </button>
                </div>
              )}
              {/* {addOnServiceData.files[0].filename.slice(-3).toLowerCase() === 'pdf' && (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded mr-4" onClick={() => handlePreview(addOnServiceData.files[0].filename)}>Preview</button>
                        )}
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded" onClick={() => handleDownload(addOnServiceData.files[0].filename)}>Download</button> */}
            </div>
          </div>
        ) : (
          <p className="text-lg">No Add-On Service data found.</p>
        )}
      </div>
    </div>
  );
};

export default AddOnServiceDetailsInNewTab;
