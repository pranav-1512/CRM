import React, { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation hook

function Verify() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token"); // Extract token from query parameter

  useEffect(() => {
    const sendVerificationRequest = async () => {
      if (token) {
        try {
          // Send POST request to backend endpoint with the token
          const response = await axios.post(
            "https://sstaxmentors-server.vercel.app/user/verification/verify",
            { token }
          );

          if (response.status === 200) {
            console.log("Verification request sent successfully.");
            // Optionally handle response data or further actions upon success
          } else {
            console.error("Failed to send verification request.");
            // Handle error cases if needed
          }
        } catch (error) {
          console.error("Error sending verification request:", error);
          // Handle network errors or other issues
        }
      }
    };

    sendVerificationRequest();
  }, [token]); // Re-run the effect if token changes

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-500">
      <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Email Verified!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for verifying your email.
        </p>
      </div>
    </div>
  );
}

export default Verify;
