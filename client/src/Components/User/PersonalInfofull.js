import React from 'react';

const PersonalInfo = () => {
  // Sample user data
  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phoneNo: '+1234567890',
    officeNo: '+1234567890',
    streetNo: '123 Street Name',
    city: 'City Name',
    state: 'State Name',
    country: 'Country Name',
    company: 'Company Name',
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-6">User Profile</h1>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-md shadow-md mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">First Name:</label>
            <span>{user.firstName}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Last Name:</label>
            <span>{user.lastName}</span>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="bg-white p-6 rounded-md shadow-md mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Email:</label>
            <span>{user.email}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Phone Number:</label>
            <span>{user.phoneNo}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Office Number:</label>
            <span>{user.officeNo}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-md shadow-md mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Street Number:</label>
            <span>{user.streetNo}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">City:</label>
            <span>{user.city}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">State:</label>
            <span>{user.state}</span>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Country:</label>
            <span>{user.country}</span>
          </div>
        </div>

        {/* Company */}
        <div className="bg-white p-6 rounded-md shadow-md mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Company:</label>
            <span>{user.company}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonalInfo;


