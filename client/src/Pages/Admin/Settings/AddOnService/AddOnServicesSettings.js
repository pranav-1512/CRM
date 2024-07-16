import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import NavigationBar from "../../NavigationBar/NavigationBar";

const AddOnServices = () => {
  const [addOnServices, setAddOnServices] = useState([]);
  const [newAddOnService, setNewAddOnService] = useState("");
  const [newSubServices, setNewSubServices] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAddOnServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddOnServices(response.data.services);
      } catch (error) {
        message.error("Error fetching add-on services");
        setErrorMessage("Error fetching add-on services");
      }
    };
    fetchAddOnServices();
  }, []);

  const handleAddAddOnService = async () => {
    try {
      await axios.post("https://sstaxmentors-server.vercel.app/admin/settings/addonservice/addNewAddOnService", {
        name: newAddOnService,
      });
      setErrorMessage("");
      setNewAddOnService("");
      message.success("Succesfully added new Service");
      // Refresh add-on services list
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddOnServices(response.data.services);
    } catch (error) {
      message.error("Error adding new add-on service");
      setErrorMessage("Error adding new add-on service");
    }
  };

  const handleAddSubService = (addOnServiceId) => {
    setNewSubServices({
      ...newSubServices,
      [addOnServiceId]: [...(newSubServices[addOnServiceId] || []), ""],
    });
  };

  const handleRemoveAddOnService = async (addOnServiceId) => {
    try {
      await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/addonservice/deleteAddOnService/${addOnServiceId}`
      );
      setErrorMessage("");
      // Refresh add-on services list
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddOnServices(response.data.services);
      message.success("Succesfully removed Service");
    } catch (error) {
      message.error("Error removing add-on service");
      setErrorMessage("Error removing add-on service");
    }
  };

  const handleRemoveSubService = async (addOnServiceId, subServiceIndex) => {
    // Initialize newSubServices[addOnServiceId] as an empty array if it's undefined
    const updatedSubServices = Array.isArray(newSubServices[addOnServiceId])
      ? [...newSubServices[addOnServiceId]]
      : [];
    updatedSubServices.splice(subServiceIndex, 1);
    setNewSubServices({
      ...newSubServices,
      [addOnServiceId]: updatedSubServices,
    });
    try {
      await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/addonservice/deleteSubService/${addOnServiceId}/${subServiceIndex}`
      );
      setErrorMessage("");
      // Refresh add-on services list
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddOnServices(response.data.services);
      message.success("Succesfully removed Sub-Service");
    } catch (error) {
      message.error("Error removing Sub-service");
      setErrorMessage("Error removing sub-service");
    }
  };

  const handleSubServiceChange = (
    addOnServiceId,
    subServiceIndex,
    newValue
  ) => {
    const updatedSubServices = { ...newSubServices };
    updatedSubServices[addOnServiceId][subServiceIndex] = newValue;
    setNewSubServices(updatedSubServices);
  };

  const handleSubmitSubServices = async (addOnServiceId) => {
    try {
      await axios.post(
        `https://sstaxmentors-server.vercel.app/admin/settings/addonservice/addSubServices/${addOnServiceId}`,
        { subServices: newSubServices[addOnServiceId] }
      );
      setErrorMessage("");
      // Refresh add-on services list
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddOnServices(response.data.services);
      message.success("Succesfully added new Sub-Services");
    } catch (error) {
      message.error("Error adding new sub-services");
      setErrorMessage("Error adding new sub-services");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
            ADD ON SERVICES SETTINGS{" "}
          </p>
          <div className="mb-4">
            <label htmlFor="newAddOnService" className="block font-bold mb-2">
              New Add-On Service:
            </label>
            <input
              type="text"
              id="newAddOnService"
              value={newAddOnService}
              onChange={(e) => setNewAddOnService(e.target.value)}
              placeholder="New Add-On Service"
              className="border border-gray-400 px-3 py-2 rounded"
            />
            <button
              onClick={handleAddAddOnService}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Add Add-On Service
            </button>
          </div>
          {Array.isArray(addOnServices) &&
            addOnServices.length > 0 &&
            addOnServices.map((addOnService) => (
              <div key={addOnService._id} className="mb-4">
                <h3 className="text-lg font-bold mb-2">{addOnService.name}</h3>
                <ul>
                  {Array.isArray(addOnService.subServices) &&
                    addOnService.subServices.map(
                      (subService, subServiceIndex) => (
                        <li key={subServiceIndex}>
                          {subService}
                          <button
                            onClick={() =>
                              handleRemoveSubService(
                                addOnService._id,
                                subServiceIndex
                              )
                            }
                            className="text-red-500 ml-2"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </li>
                      )
                    )}
                </ul>
                <div>
                  {Array.isArray(newSubServices[addOnService._id]) &&
                    newSubServices[addOnService._id].map(
                      (subService, subServiceIndex) => (
                        <div key={subServiceIndex}>
                          <input
                            type="text"
                            value={
                              newSubServices[addOnService._id][
                                subServiceIndex
                              ] || ""
                            }
                            onChange={(e) =>
                              handleSubServiceChange(
                                addOnService._id,
                                subServiceIndex,
                                e.target.value
                              )
                            }
                            placeholder="New Sub-service"
                            className="border border-gray-400 px-3 py-2 rounded mr-2"
                          />
                          <button
                            onClick={() =>
                              handleRemoveSubService(
                                addOnService._id,
                                subServiceIndex
                              )
                            }
                            className="text-red-500"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      )
                    )}
                </div>
                <button
                  onClick={() => handleAddSubService(addOnService._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Add Sub-service
                </button>
                <button
                  onClick={() => handleSubmitSubServices(addOnService._id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Submit Sub-services
                </button>
                <button
                  onClick={() => handleRemoveAddOnService(addOnService._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Remove Add-On Service
                </button>
                <hr className="my-4" />
              </div>
            ))}
          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddOnServices;
