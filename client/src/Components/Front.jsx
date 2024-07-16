import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

export default function Front() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/dashboardImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCarouselImages(response.data.dashboardImages);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    let interval;
    if (!isManualControl) {
      interval = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
        );
      }, 5000); // Change images every 5 seconds if not manually controlled
    }

    return () => clearInterval(interval);
  }, [carouselImages, isManualControl]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsManualControl(true);
  };

  const handleOnMouseOver = () => {
    setIsManualControl(true);
  };

  const handleOnMouseOut = () => {
    setIsManualControl(false);
  };

  return (
    <section className="z-10 w-full h-full pb-20">
      <div className="sm:w-11/12 mx-auto h-full">
        {carouselImages.length > 0 && (
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={!isManualControl} // Enable autoPlay only if not manually controlled
            interval={5000}
            selectedItem={currentSlide} // Set the current slide index
            className="h-full"
            onChange={handleSlideChange} // Handle slide change
            onMouseOver={handleOnMouseOver} // Pause autoPlay on mouse over
            onMouseOut={handleOnMouseOut} // Resume autoPlay on mouse out
          >
            {carouselImages.map((image, index) => (
              <div key={index}>
                <img
                  src={`data:image/jpeg;base64,${image.data}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
