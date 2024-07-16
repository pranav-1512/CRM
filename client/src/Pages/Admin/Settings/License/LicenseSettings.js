import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import "../../../../Custommodal.css";
import NavigationBar from "../../NavigationBar/NavigationBar";

const LicenseSettings = () => {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmToggleActive, setConfirmToggleActive] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState(null);
  const [fieldToToggleActive, setFieldToToggleActive] = useState(null);


  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/license/Licensesnames"
      );
      setNames(response.data);
    } catch (error) {
      message.error("Error fetching names");
      setError("Error fetching names");
    } finally {
      setLoading(false);
    }
  };

  const handleAddName = async () => {
    try {
      setLoading(true);

      if (!newName.trim()) {
        message.info("Name cannot be empty");
        setError("Name cannot be empty");
        return;
      }

      if (!newDescription.trim()) {
        message.info("Description cannot be empty");
        setError("Description cannot be empty");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/settings/license/addnewLicensefield",
        {
          name: newName.trim(),
          description: newDescription.trim(),
        }
      );

      setNames([...names, response.data]);
      setNewName("");
      setNewDescription("");
      setError("");
      message.success("Succesfully added new Field");
    } catch (error) {
      message.error("Error adding name");

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        message.error("Error adding name");
        setError("Error adding name");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveName = async (id) => {
    try {
      setLoading(true);
      if (!confirmRemove) {
        setConfirmRemove(true);
        setFieldToRemove(id);
        return;
      }

      const response = await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/license/removeLicense/${id}`
      );
      setNames(names.filter((field) => field._id !== id));
      setError(response.data.message);
      message.success("Successfully removed field");
    } catch (error) {
      message.error("Error removing ROC filing field");

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        message.error("Error removing ROC filing field");
        setError("Error removing ROC filing field");
      }
    } finally {
      setLoading(false);
      setConfirmRemove(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      setLoading(true);
      if (!confirmToggleActive) {
        setConfirmToggleActive(true);
        setFieldToToggleActive({ id, isActive: !isActive });
        return;
      }

      const response = await axios.put(
        `https://sstaxmentors-server.vercel.app/admin/settings/license/toggleActiveFieldLicense/${id}`
      );

      const updatedFields = names.map((field) => {
        if (field._id === id) {
          return { ...field, isActive: !isActive ? "Active" : "Inactive" };
        }
        return field;
      });
      setNames(updatedFields);
    

      // setError(response.data.message);
      fetchNames();
      message.success(`${response.data.message}`);
    } catch (error) {
      message.error(`Error setting field ${!isActive ? "inactive" : "active"}`);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        message.error(
          `Error setting field ${!isActive ? "inactive" : "active"}`
        );
        setError(`Error setting field ${!isActive ? "inactive" : "active"}`);
      }
    } finally {
      setLoading(false);
      setConfirmToggleActive(false);
    }
  };

  useEffect(() => {
    fetchNames(); // Fetch initial state from backend when component mounts or dependencies change
  }, [confirmToggleActive]);

  const handleCancelRemove = () => {
    setConfirmRemove(false);
    setFieldToRemove(null);
  };

  const handleCancelToggleActive = () => {
    setConfirmToggleActive(false);
    setFieldToToggleActive(null);
  };

  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
            LICENSE SETTINGS{" "}
          </p>
          <div className="mb-4">
            <label htmlFor="newFieldName" className="block font-bold mb-2">
              New License Name:
            </label>
            <input
              type="text"
              id="newFieldName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New License Name"
              className="border border-gray-400 px-3 py-2 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newFieldDescription"
              className="block font-bold mb-2"
            >
              Description:
            </label>
            <input
              type="text"
              id="newFieldDescription"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              className="border border-gray-400 px-3 py-2 rounded w-full"
            />
          </div>

          <button
            onClick={handleAddName}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Add New License
          </button>

          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

          <div>
            <h3 className="text-xl font-bold mb-3 mt-8">Existing Fields:</h3>
            <ul>
              {names.map((field) => (
                <li key={field._id} className="mb-2">
                  {field.name} - {field.description}{" "}
                  {/* <button
                    onClick={() => {
                      setConfirmRemove(true);
                      setFieldToRemove(field._id);
                    }}
                    disabled={loading}
                    className="text-red-500"
                  >
                    Remove
                  </button>{" "} */}
                  <button
                    onClick={() => {
                      setConfirmToggleActive(true);
                      setFieldToToggleActive({
                        id: field._id,
                        isActive: field.isActive,
                      });
                    }}
                    disabled={loading}
                    className={
                      field.status === "active"
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {field.status === "active" ? "Inactive" : "Active"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Modal
            title="Confirm Removal"
            visible={confirmRemove}
            onOk={() => {
              handleRemoveName(fieldToRemove);
              setConfirmRemove(false);
            }}
            onCancel={() => setConfirmRemove(false)}
            className="custom-modal"
          >
            <p>Are you sure you want to remove this field?</p>
          </Modal>
          <Modal
            title={
              fieldToToggleActive && fieldToToggleActive.isActive
                ? "Confirm Deactivation"
                : "Confirm Activation"
            }
            visible={confirmToggleActive}
            onOk={() => {
              handleToggleActive(
                fieldToToggleActive.id,
                fieldToToggleActive.isActive
              );
              setConfirmToggleActive(false);
            }}
            onCancel={() => setConfirmToggleActive(false)}
            className="custom-modal"
          >
            <p>
              Are you sure you want to{" "}
              {fieldToToggleActive && fieldToToggleActive.isActive
                ? "deactivate"
                : "activate"}{" "}
              this field?
            </p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LicenseSettings;
