import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import "../../../../Custommodal.css";
import NavigationBar from "../../NavigationBar/NavigationBar";

const CompanySettings = () => {
  const [mainNames, setMainNames] = useState([]);
  const [mainName, setMainName] = useState("");
  const [subInputs, setSubInputs] = useState([{ subInput: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmToggleActive, setConfirmToggleActive] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState(null);
  const [fieldToToggleActive, setFieldToToggleActive] = useState(null);


  useEffect(() => {
    fetchMainNames();
  }, []);

  const fetchMainNames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/company/CompanyDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMainNames(response.data);
    } catch (error) {
      message.error("Error fetching main names");
      setError("Error fetching main names");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubInput = () => {
    setSubInputs([...subInputs, { subInput: "" }]);
  };

  const handleSubInputChange = (index, value) => {
    const updatedSubInputs = [...subInputs];
    updatedSubInputs[index].subInput = value;
    setSubInputs(updatedSubInputs);
  };

  const handleRemoveSubInput = (index) => {
    const updatedSubInputs = [...subInputs];
    updatedSubInputs.splice(index, 1);
    setSubInputs(updatedSubInputs);
  };

  const handleAddMainName = async () => {
    try {
      setLoading(true);

      if (!mainName.trim()) {
        message.info("Main name cannot be empty");
        setError("Main Name cannot be empty");
        return;
      }

      if (
        subInputs.length === 0 ||
        subInputs.every((input) => !input.subInput.trim())
      ) {
        message.info("Atleast one sub Input is required");
        setError("At least one Sub Input is required");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/settings/company/addNewCompanyField",
        {
          mainName: mainName.trim(),
          subInputs: subInputs.map((input) => input.subInput.trim()),
        }
      );

      setMainNames([...mainNames, response.data]);
      setSubInputs([{ subInput: "" }]);
      setError("");

      message.success("Succesfully added new Field");
    } catch (error) {
      message.error("Error adding main name");

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error adding main name");
        message.error("Error adding main name");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleRemoveMainName = async (id) => {
    try {
      setLoading(true);
      if (!confirmRemove) {
        setConfirmRemove(true);
        setFieldToRemove(id);
        return;
      }

      const response = await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/company/removeCompanyField/${id}`
      );
      setMainNames(mainNames.filter((field) => field._id !== id));
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
        `https://sstaxmentors-server.vercel.app/admin/settings/company/toggleActiveFieldCompany/${id}`
      );

      const updatedFields = mainNames.map((field) => {
        if (field._id === id) {
          return { ...field, isActive: !isActive ? "Active" : "Inactive" };
        }
        return field;
      });
      setMainNames(updatedFields);
      // setError(response.data.message);
      fetchMainNames();
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
    fetchMainNames(); // Fetch initial state from backend when component mounts or dependencies change
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
            COMPANY SETTINGS{" "}
          </p>

          <div className="mb-4">
            <label className="block mb-2">Main Name:</label>
            <input
              type="text"
              value={mainName}
              onChange={(e) => setMainName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Sub Inputs:</label>
            {subInputs.map((input, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={input.subInput}
                  onChange={(e) => handleSubInputChange(index, e.target.value)}
                  className="border p-2 mr-2 w-full"
                />
                <button
                  onClick={() => handleRemoveSubInput(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddSubInput}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Sub Input
            </button>
          </div>

          <button
            onClick={handleAddMainName}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Add New Field
          </button>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div>
            <h3 className="text-xl font-bold mb-3 mt-8">Existing Fields:</h3>
            <ul>
              {mainNames.map((field) => (
                <li key={field._id} className="mb-2">
                  {field.mainName} - {field.subInputs[0]}{" "}
                 {/*  <button
                    onClick={() => {
                      setConfirmRemove(true);
                      setFieldToRemove(field._id);
                    }}
                    disabled={loading}
                    className="text-red-500"
                  >
                    Remove
                  </button>{" "}
                  */}
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
              handleRemoveMainName(fieldToRemove);
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

export default CompanySettings;
