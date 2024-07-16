import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal } from "antd"; // Import Modal from antd
import "../../../../Custommodal.css";
import NavigationBar from "../../NavigationBar/NavigationBar";

const AdminBannerSettings = () => {
  const [loginImages, setLoginImages] = useState([]);
  const [dashboardImages, setDashboardImages] = useState([]);
  const [loginImage, setLoginImage] = useState(null);
  const [dashboardImage, setDashboardImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null); // Track image to delete
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // Track visibility of confirmation modal

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/banner/getBannerSettingsImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoginImages(response.data.loginImages);
        setDashboardImages(response.data.dashboardImages);
        setIsLoading(false);
      } catch (error) {
        message.error("Error fetching images");
        setErrorMessage("Error fetching images");
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleLoginImageChange = (event) => {
    setLoginImage(event.target.files[0]);
  };

  const handleDashboardImageChange = (event) => {
    setDashboardImage(event.target.files[0]);
  };

  const handleAddLoginImage = async () => {
    if (!loginImage) return;
    const formData = new FormData();
    formData.append("title", "login");
    formData.append("image", loginImage);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sstaxmentors-server.vercel.app/admin/settings/banner/addBannerImage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Fetch images again
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/banner/getBannerSettingsImages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoginImages(response.data.loginImages);
      setLoginImage(null);
      setErrorMessage("");
      message.success("Succesfully added new Login Image");
    } catch (error) {
      message.error("Error adding Login Image");
      setErrorMessage("Error adding login image");
    }
  };

  const handleAddDashboardImage = async () => {
    if (!dashboardImage) return;
    const formData = new FormData();
    formData.append("title", "dashboard");
    formData.append("image", dashboardImage);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sstaxmentors-server.vercel.app/admin/settings/banner/addBannerImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch images again
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/settings/banner/getBannerSettingsImages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboardImages(response.data.dashboardImages);
      setDashboardImage(null);
      setErrorMessage("");
      message.success("Succesfully added new Dashboard Image");
    } catch (error) {
      setErrorMessage("Error adding dashboard image");
      message.error("Error adding dashboard image");
    }
  };

  const handleImageClick = async (imageName, title) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/admin/settings/banner/getBannerImage/${imageName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      setSelectedImage(url);
    } catch (error) {
      message.error("Error fetching image");
      console.error("Error fetching image:", error);
    }
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleImageDelete = async (imageName, title) => {
    setImageToDelete({ imageName, title }); // Set the image to delete in the state
    setConfirmModalVisible(true); // Open the confirmation modal
  };

  const confirmDeleteImage = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/settings/banner/deleteBannerImage",
        { imageName: imageToDelete.imageName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (imageToDelete.title === "login") {
        setLoginImages(
          loginImages.filter(
            (img) => img.image.filename !== imageToDelete.imageName
          )
        );
      } else {
        setDashboardImages(
          dashboardImages.filter(
            (img) => img.image.filename !== imageToDelete.imageName
          )
        );
      }
      setErrorMessage("");
      message.success("Succesfully deleted Image");
    } catch (error) {
      setErrorMessage("Error deleting image");
      message.error("Error deleting image");
    } finally {
      setConfirmModalVisible(false); // Close the confirmation modal
    }
  };

  const handleCancelDelete = () => {
    setConfirmModalVisible(false); // Close the confirmation modal without deleting
  };

  return (
    <div>
    {!selectedImage &&  <NavigationBar /> }

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
            BANNER SETTINGS{" "}
          </p>
          <div className="mb-4">
            <label htmlFor="newAddOnService" className="block font-bold mb-2">
              Login Page Images
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleLoginImageChange}
              />
              <button
                onClick={handleAddLoginImage}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload Image
              </button>
            </div>
            <div className="flex flex-wrap mt-4">
              {loginImages.map((image, index) => (
                <div key={index} className="mr-4 mb-4">
                  {/* Extracting filename after the underscore */}
                  <p
                    onClick={() =>
                      handleImageClick(image.image.filename, "login")
                    }
                    className="cursor-pointer"
                  >
                    {image.image.filename.split("_")[1]}
                  </p>
                  <button
                    onClick={() =>
                      handleImageDelete(image.image.filename, "login")
                    }
                    className="text-red-500 hover:text-red-700 font-bold mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <label htmlFor="newAddOnService" className="block font-bold mb-2">
              Dashboard Page Images
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleDashboardImageChange}
              />
              <button
                onClick={handleAddDashboardImage}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload Image
              </button>
            </div>
            <div className="flex flex-wrap mt-4">
              {dashboardImages.map((image, index) => (
                <div key={index} className="mr-4 mb-4">
                  {/* Extracting filename after the underscore */}
                  <p
                    onClick={() =>
                      handleImageClick(image.image.filename, "dashboard")
                    }
                    className="cursor-pointer"
                  >
                    {image.image.filename.split("_")[1]}
                  </p>
                  <button
                    onClick={() =>
                      handleImageDelete(image.image.filename, "dashboard")
                    }
                    className="text-red-500 hover:text-red-700 font-bold mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        </div>
        {/* Modal for image preview */}
        {selectedImage && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-md max-w-lg">
              <img src={selectedImage} alt="Preview" className="max-w-full" />
              <button
                onClick={handleClosePreview}
                className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
        {/* Confirmation Modal */}
        <Modal
          title="Confirm Deletion"
          open={confirmModalVisible}
          onOk={confirmDeleteImage}
          onCancel={handleCancelDelete}
          className="custom-modal"
        >
          <p>Are you sure you want to delete this image?</p>
        </Modal>
      </div>
    </div>
  );
};

export default AdminBannerSettings;
