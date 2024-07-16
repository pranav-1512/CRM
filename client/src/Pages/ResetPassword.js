// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { message } from 'antd';

// function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const [userType, setUserType] = useState('user');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = new URLSearchParams(location.search).get('token');

//   const handleResetPassword = async () => {
//     if (!token) {
//       message.error('Token is missing.');
//       return;
//     }

//     try {
//       const response = await axios.post('https://sstaxmentors-server.vercel.app/login/reset-password', {
//         token,
//         password,
//         userType
//       });
//       if (response.data.success) {
//         message.success('Password has been updated.');
//         navigate('/login');
//       } else {
//         message.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Failed to reset password:', error);
//       message.error(error.response?.data?.message || 'Failed to reset password');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Reset Your Password
//         </h2>
//         <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="password" className="sr-only">New Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="user"
//                 name="userType"
//                 type="radio"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 checked={userType === "user"}
//                 onChange={() => setUserType("user")}
//               />
//               <label htmlFor="user" className="ml-2 block text-sm text-gray-900">
//                 User
//               </label>
//             </div>
//             <div className="flex items-center">
//               <input
//                 id="employee"
//                 name="userType"
//                 type="radio"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 checked={userType === "employee"}
//                 onChange={() => setUserType("employee")}
//               />
//               <label htmlFor="employee" className="ml-2 block text-sm text-gray-900">
//                 Employee
//               </label>
//             </div>
//             <div className="flex items-center">
//               <input
//                 id="admin"
//                 name="userType"
//                 type="radio"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 checked={userType === "admin"}
//                 onChange={() => setUserType("admin")}
//               />
//               <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">
//                 Admin
//               </label>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Reset Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ResetPassword;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handleResetPassword = async (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally
    if (!token) {
      message.error('Token is missing.');
      return;
    }

    try {
      const response = await axios.post('https://sstaxmentors-server.vercel.app/login/reset-password', {
        token,
        password,
        userType
      });
      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/'); // Navigate to login page after a few seconds
        }, 3000); // Wait for 3 seconds before closing the modal and redirecting
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      message.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">User Type:</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="userType"
                  value="user"
                  checked={userType === 'user'}
                  onChange={() => setUserType('user')}
                />
                <span className="ml-2">User</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="userType"
                  value="employee"
                  checked={userType === 'employee'}
                  onChange={() => setUserType('employee')}
                />
                <span className="ml-2">Employee</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="userType"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={() => setUserType('admin')}
                />
                <span className="ml-2">Admin</span>
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
        {showSuccessModal && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-bold">Success</h3>
              <p className="text-sm">Your password has been successfully updated.</p>
              <p className="text-sm">Redirecting you to the login page...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;