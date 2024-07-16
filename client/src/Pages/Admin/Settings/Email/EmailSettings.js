import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminEmailComponent from "../../../../Components/Admin/AdminEmail";
import { message } from "antd";
import NavigationBar from "../../NavigationBar/NavigationBar";

const EmailSettingsPage = () => {
  const [emailSettings, setEmailSettings] = useState([]);
  const [newEmailSetting, setNewEmailSetting] = useState({
    title: "",
    subject: "",
    text: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/email/getEmailSettingsFields"
      );
      setEmailSettings(response.data);
    } catch (error) {
      console.error("Error fetching email settings:", error);
      setError("Error fetching email settings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmailSetting({ ...newEmailSetting, [name]: value });
  };

  const addEmailSetting = async () => {
    try {
      await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/settings/email/addNewEmailField",
        newEmailSetting
      );
      fetchEmailSettings();
      setNewEmailSetting({ title: "", subject: "", text: "" });
    } catch (error) {
      console.error("Error adding new email setting:", error);
      setError("Error adding new email setting");
    }
  };

  const deleteEmailSetting = async (id) => {
    try {
      await axios.delete(
        `https://sstaxmentors-server.vercel.app/admin/settings/email/deleteEmailField/${id}`
      );
      fetchEmailSettings();
    } catch (error) {
      console.error("Error deleting email setting:", error);
      setError("Error deleting email setting");
    }
  };

  const updateEmailSetting = async (id, updatedEmailSetting) => {
    try {
      const response = await axios.put(
        `https://sstaxmentors-server.vercel.app/admin/settings/email/updateEmailField/${id}`,
        updatedEmailSetting
      );

      if (response.status === 200) {
        message.success("data added successfully");
      } else {
        message.error("Failed the data process please try again.");
      }
      fetchEmailSettings();
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating email setting:", error);
      setError("Error updating email setting");
    }
  };

  const handleEdit = (id) => {
    const emailSettingToEdit = emailSettings.find(
      (setting) => setting._id === id
    );
    setNewEmailSetting(emailSettingToEdit);
    setEditMode(true);
    setEditingId(id);
  };

  const handleSave = async () => {
    if (editMode && editingId) {
      await updateEmailSetting(editingId, newEmailSetting);
    } else {
      await addEmailSetting();
    }
    setNewEmailSetting({ title: "", subject: "", text: "" });
    setEditMode(false);
    setEditingId(null);
  };

  return (
    <div className="bg-gray-100">
      <NavigationBar />

      <p className="font-bold text-3xl m-8 text-blue-500 mb-10">
        EMAIL SETTINGS{" "}
      </p>
      <div className=" mx-5 bg-white shadow-md rounded-md p-4 my-8">
        <AdminEmailComponent />
      </div>
      <div className=" mx-5 bg-white shadow-xl rounded-md p-4">
        <h2 className="text-xl font-bold  text-gray-600 m-4">
          Add New Email Data:
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newEmailSetting.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="subject"
            value={newEmailSetting.subject}
            onChange={handleInputChange}
            placeholder="Subject"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="text"
            value={newEmailSetting.text}
            onChange={handleInputChange}
            placeholder="Text"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Save
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-600 m-4 mt-14">
            Existing Email Data:
          </h2>
          {emailSettings.length > 0 ? (
            <ul>
              {emailSettings.slice(1).map((setting) => (
                <li key={setting._id} className="mb-4">
                  <div className="border rounded-lg p-4 shadow-md bg-white">
                    <p className="text-lg font-bold mb-2">{setting.title}</p>
                    <p className="text-gray-600 mb-2">
                      <strong>Subject:</strong> {setting.subject}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Text:</strong> {setting.text}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEdit(setting._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 transition duration-300 ease-in-out focus:outline-none focus:bg-blue-600"
                      >
                        Edit
                      </button>
                      {/* <button onClick={() => deleteEmailSetting(setting._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:bg-red-600">
                        Delete
                      </button> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{error ? error : "No existing email settings found."}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSettingsPage;
