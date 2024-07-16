import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const ImageCarousel = () => {
  const [loginImages, setLoginImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/loginImages"
        );
        if (response.data && response.data.loginImages) {
          const filteredImages = response.data.loginImages.filter(
            (image) => image.data
          );
          setLoginImages(filteredImages);
        } else {
          message.error("No login images available");
        }
      } catch (error) {
        message.error("Error fetching images");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loginImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % loginImages.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [loginImages]);

  return (
    <div className="h-5/6 w-full shadow-md rounded overflow-hidden relative">
      {loginImages.length > 0 && (
        <img
          src={`data:image/jpeg;base64,${loginImages[currentImageIndex].data}`}
          alt={`Slide ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default ImageCarousel;
