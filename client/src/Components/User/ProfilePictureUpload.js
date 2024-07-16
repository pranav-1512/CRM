import React, { useState } from 'react';

const ProfilePictureUpload = () => {
  const [image, setImage] = useState(null);

  // Function to handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Display circular profile picture */}
      <div 
        className="w-32 h-32 rounded-full overflow-hidden mb-4 cursor-pointer"
        onClick={() => {
          // Implement your action when the profile picture is clicked
          console.log('Profile picture clicked!');
        }}
      >
        {image ? (
          <img 
            src={image} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600">Upload</span>
          </div>
        )}
      </div>
      
      {/* Input for image upload */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="mb-4"
      />
    </div>
  );
};

export default ProfilePictureUpload;
