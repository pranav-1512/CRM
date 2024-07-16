import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomepageCarousel = () => {
  const [dashboardImages, setDashboardImages] = useState([]);

  useEffect(() => {
    const fetchDashboardImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/Home/dashboardImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardImages(response.data.dashboardImages);
      } catch (error) {
        console.error("Error fetching dashboard images:", error);
      }
    };

    fetchDashboardImages();
  }, []);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex justify-center items-center">
      {(
        <div className="w-full">
          <Slider {...settings}>
            {dashboardImages.map((image, index) => (
              <div key={index} className="w-full">
                <img
                  src={`data:image/jpeg;base64,${image.data}`}
                  alt={image.filename}
                  className="object-cover w-full h-auto"
                />
              </div>
            ))}
          </Slider>
        </div>
      )
      }
    </div>
  );
};

export default HomepageCarousel;
