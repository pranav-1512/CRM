import React from "react";

const AcceptModel = ({ data, handleAcceptModel, handleCloseModal }) => {

  const handleCancel = () => {
    handleCloseModal();
  };

  const handleAccept = () => {
    handleAcceptModel(data); // Call handleAcceptModel with the data
    handleCloseModal(); // Close the modal
  };
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white w-96 rounded-lg shadow-lg">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800">
              Are you sure you want to Accept?
            </h4>
          </div>
          <div className="flex justify-evenly p-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 mr-4 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              No
            </button>
            <button
              className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-red-600"
              onClick={handleAccept} >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptModel;
