import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

function ForgotPasword() {
  const [email, setemail] = useState("");

  const [userType, setUserType] = useState("user"); // Default userType is 'user'

  let navigate = useNavigate();

  const login = async () => {
    await axios
      .post("https://sstaxmentors-server.vercel.app/login/forgot-password", {
        email: email,
        userType: userType, // Add userType to the data sent to the backend
      })
      .then((response) => {
        if (response.data.success === true) {
          navigate("/login");
          message.success("Password has been updated");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Could not update password");
      });
    // console.log(email, userType);
    // console.log(email,userType)
    message.info("Verify yourself via email");
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-44 p-9 bg-white rounded shadow-md">
        <label className="text-4xl font-bold ">Login</label>
        <div className="mb-4">
          <label className="block mb-2">User Type:</label>
          <label className="inline-block mr-4">
            <input
              type="radio"
              name="userType"
              value="user"
              checked={userType === "user"}
              onChange={() => setUserType("user")}
            />
            User
          </label>
          <label className="inline-block mr-4">
            <input
              type="radio"
              name="userType"
              value="employee"
              checked={userType === "employee"}
              onChange={() => setUserType("employee")}
            />
            Employee
          </label>
          <label className="inline-block">
            <input
              type="radio"
              name="userType"
              value="admin"
              checked={userType === "admin"}
              onChange={() => setUserType("admin")}
            />
            Admin
          </label>
        </div>
        <div className="mt-8">
          <label className="block mb-4">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              className="border   focus: border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring  focus:ring-blue-200  mt-1 w-full"
            />
          </label>
        </div>
        <div className="text-blue-500 mt-3">
          <Link to="/">Don't have an account?</Link>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasword;