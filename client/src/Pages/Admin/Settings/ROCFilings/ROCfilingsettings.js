import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import "../../../../Custommodal.css";
import NavigationBar from "../../NavigationBar/NavigationBar";

const ROCfilingssettings = () => {
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldDescription, setNewFieldDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmToggleActive, setConfirmToggleActive] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState(null);
  const [fieldToToggleActive, setFieldToToggleActive] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/rocfilings/ROCfilingsfields"
      );
      setFields(response.data);
    } catch (error) {
      message.error("Error fetching ROC filing fields");
      setError("Error fetching ROC filing fields");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async () => {
    try {
      setLoading(true);

      if (!newFieldName.trim()) {
        message.error("Field name cannot be empty");
        setError("Field name cannot be empty");
        return;
      }

      if (!newFieldDescription.trim()) {
        message.error("Field description cannot be empty");
        setError("Field description cannot be empty");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/settings/rocfilings/addNewROCfilingfield",
        {
          fieldName: newFieldName.trim(),
          fieldDescription: newFieldDescription.trim(),
        }
      );

      setFields([...fields, response.data]);
      setNewFieldName("");
      setNewFieldDescription("");
      setError("");
      message.success("Successfully added new Field");
    } catch (error) {
      message.error("Error adding ROC filing field");

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        message.error("Error adding ROC filing field");
        setError("Error adding ROC filing field");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveField = async (id) => {
    try {
      setLoading(true);
      if (!confirmRemove) {
        setConfirmRemove(true);
        setFieldToRemove(id);
        return;
      }

      const response = await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/rocfilings/removeROCfilingfield/${id}`
      );
      setFields(fields.filter((field) => field._id !== id));
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
        `https://sstaxmentors-server.vercel.app/admin/settings/rocfilings/toggleActiveFieldROC/${id}`
      );

      const updatedFields = fields.map((field) => {
        if (field._id === id) {
          return { ...field, isActive: !isActive ? "Active" : "Inactive" };
        }
        return field;
      });
      setFields(updatedFields);

      // setError(response.data.message);
      fetchFields();
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
    fetchFields(); // Fetch initial state from backend when component mounts or dependencies change
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
            ROC FILINGS SETTINGS{" "}
          </p>
          <div className="mb-4">
            <label htmlFor="newFieldName" className="block font-bold mb-2">
              New Field Name:
            </label>
            <input
              type="text"
              id="newFieldName"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="New Field Name"
              className="border border-gray-400 px-3 py-2 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newFieldDescription"
              className="block font-bold mb-2"
            >
              Field Description:
            </label>
            <input
              type="text"
              id="newFieldDescription"
              value={newFieldDescription}
              onChange={(e) => setNewFieldDescription(e.target.value)}
              placeholder="Field Description"
              className="border border-gray-400 px-3 py-2 rounded w-full"
            />
          </div>

          <button
            onClick={handleAddField}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Add New Field
          </button>

          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

          <div>
            <h3 className="text-xl font-bold mb-3 mt-8">Existing Fields:</h3>
            <ul>
              {fields.map((field) => (
                <li key={field._id} className="mb-2">
                  {field.fieldName} - {field.fieldDescription}{" "}
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
        </div>
        <Modal
          title="Confirm Removal"
          visible={confirmRemove}
          onOk={() => {
            handleRemoveField(fieldToRemove);
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
  );
};

export default ROCfilingssettings;
