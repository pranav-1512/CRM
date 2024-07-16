import React, { useState, useEffect } from "react";
import { message } from "antd";

import axios from "axios";

function AdminEmailComponent() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/getAdminsEmail"
        );
        setEmails(response.data.adminEmails);
        // setSelectedEmail(response.data.email);
        const selected = response.data.adminEmails.find(email => email.status === "true");
        if (selected) {
          setSelectedEmail(selected.email);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }

    fetchEmails();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setNewEmail(selectedEmail);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://sstaxmentors-server.vercel.app/admin/emails", {
        email: newEmail,
        password: newPassword,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding email:", error);
    }
  };

  const handleRadioChange = async (event) => {
    const selected = event.target.value;
    if (selected !== selectedEmail) {
      try {
        const response = await axios.post(
          "https://sstaxmentors-server.vercel.app/admin/selectAdminsEmail",
          {
            email: selected,
          }
        );

        if (response.status === 200) {
          message.success("Your email has been changed successfully!");
        setSelectedEmail(selected);

        } else {
          message.error("Failed to change email. Please try again later.");
        }

        // window.location.reload();
      } catch (error) {
        console.error("Error selecting email:", error);
      }
    }
  };

  return (
    // <div className="w-full mx-5 bg-white shadow-md rounded-md p-4 my-8">
    <div className="mb-4">
      <h1 className="text-lg text-gray-600 font-semibold mb-2">
        {" "}
        Add New Email
      </h1>
      <div className="mb-4">
        <input
          className="border border-gray-300 px-3 py-2 rounded-md w-full mb-2 focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          placeholder="Enter email"
          value={newEmail}
          onChange={handleChange}
        />
        <input
          className="border border-gray-300 px-3 py-2 rounded-md w-full mb-2 focus:outline-none focus:ring focus:border-blue-500"
          type="password"
          placeholder="Enter password"
          value={newPassword}
          onChange={handlePasswordChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2 focus:outline-none"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
      </div>
      <div>
        <h1 className="text-lg text-gray-600 font-semibold mb-2">
          {" "}
          Existing Emails
        </h1>
        {emails && emails.length > 0 ? (
          <>
            {emails.map((email) => (
              <div key={email._id} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={email._id}
                  name="emails"
                  value={email.email}
                  checked={email.email === selectedEmail}
                  onChange={handleRadioChange}
                  className="mr-2 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={email._id} className="ml-2">
                  {email.email}
                </label>
              </div>
            ))}
          </>
        ) : (
          <p>No emails found</p>
        )}
      </div>
    </div>
    // </div>
  );
}

export default AdminEmailComponent;
