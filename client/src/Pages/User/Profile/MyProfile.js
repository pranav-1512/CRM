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
  const [emailError, setEmailError] = useState(false);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://sstaxmentors-server.vercel.app/user/profile/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response) {
          throw new Error("Failed to fetch profile data");
        }

        const data = response.data;
        setUserData(data);
        setEditedData(data.user);
      } catch (error) {
        console.error(error);
        console.log("Error", error.response);
        if (error.response && error.response.status === 500) {
          setLogout(true);
          alert("Session expired. Please login again.");
          navigate("/");
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Reset emailError state when user starts typing in the email field
    if (name === "email" && emailError) {
      setEmailError(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData.user); // Reset edited data to original user data
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is falsy

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    const year = date.getFullYear();

    // Pad day and month with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Return the formatted date string in dd/mm/yyyy format
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  // Get formatted date string for the input value
  const formattedDOB = formatDate(editedData.DOB);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/user/profile/updateprofile",
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
        alert("Invalid data or error occurred");
      } else {
        message.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen flex justify-center items-center bg-gray-100 ">
        <div className="w-full max-w-lg mt-10 p-6 bg-white rounded shadow-md">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4 text-center">
            MY PROFILE
          </h2>
          <form className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    First Name:
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={editedData.firstname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={editedData.lastname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Email:
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      emailError
                        ? "border-red-500"
                        : isEditing
                        ? "border-blue-500"
                        : "border-gray-300"
                    } rounded`}
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="Phone_number"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Phone number:
                  </label>
                  <input
                    type="text"
                    id="Phone_number"
                    name="Phone_number"
                    value={editedData.Phone_number}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="DOB"
                  className="block text-sm font-semibold mb-1 text-gray-600"
                >
                  Date of Birth:
                </label>
                <input
                  type="text"
                  id="DOB"
                  name="DOB"
                  value={formattedDOB}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    isEditing ? "border-blue-500" : "border-gray-300"
                  } rounded`}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Professional Details */}
            {/* <div>
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyname" className="block text-sm font-semibold mb-1 text-gray-600">
                  Company Name:
                </label>
                <input
                  type="text"
                  id="companyname"
                  name="companyname"
                  value={editedData.companyname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${isEditing ? 'border-blue-500' : 'border-gray-300'} rounded`}
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold mb-1 text-gray-600">
                  Designation:
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={editedData.destination}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${isEditing ? 'border-blue-500' : 'border-gray-300'} rounded`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div> */}

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                <label htmlFor="officenumber" className="block text-sm font-semibold mb-1 text-gray-600">
                  Office Number:
                </label>
                <input
                  type="text"
                  id="officenumber"
                  name="officenumber"
                  value={editedData.officenumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${isEditing ? 'border-blue-500' : 'border-gray-300'} rounded`}
                  readOnly={!isEditing}
                />
              </div> */}
                <div>
                  <label
                    htmlFor="streetname"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Street Name:
                  </label>
                  <input
                    type="text"
                    id="streetname"
                    name="streetname"
                    value={editedData.streetname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    City:
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editedData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Landmark:
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={editedData.landmark}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    State:
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={editedData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold mb-1 text-gray-600"
                  >
                    Country:
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={editedData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      isEditing ? "border-blue-500" : "border-gray-300"
                    } rounded`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
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
    </div>
  );
}

export default MyProfile;
