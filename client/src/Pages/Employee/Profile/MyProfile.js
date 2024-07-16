import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import { message } from "antd";

function MyProfile() {
  let navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/employee/Profile1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response) {
          throw new Error("Failed to fetch profile data");
        }
        const data = response.data;
        setUserData(data);
        setEditedData(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        if (error.response && error.response.status === 500) {
          alert("Session expired. Please login again.");
          navigate("/");
        }
      }
    };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email" && emailError) {
      setEmailError(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/employee/updateprofile",
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error === "Email already in use") {
        setEmailError(true);
        message.info("Email is already in use");
      } else if (response.data.error) {
        message.error("Invalid data or error occurred");
      } else {
        message.success("Profile updated successfully!");
        switch (response.data.m2) {
          case 1:
          case 2:
            // window.location.reload();
            fetchProfileData()
            break;
          case 3:
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            break;
          default:
          // Handle other cases if needed
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavigationBar/>
      <hr></hr>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">MY PROFILE</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold mb-1"
          >
            First Name:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={editedData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{userData.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold mb-1"
          >
            Last Name:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={editedData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{userData.lastName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="email"
              name="email"
              readOnly
              value={editedData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="Phone_number"
            className="block text-sm font-semibold mb-1"
          >
            Phone number
          </label>
          {isEditing ? (
            <input
              type="text"
              id="Phone_number"
              name="Phone_number"
              value={editedData.Phone_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{userData.Phone_number}</p>
          )}
        </div>

        {isEditing ? (
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </form>
    </div>
    </div>
  );
}

export default MyProfile;
