import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";

const AddOnServicesPage = () => {
  let navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [description, setDescription] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/addonservice/getAddOnServices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response) {
          throw new Error("Failed to fetch profile data");
        }
        setCategories(response.data.services);
      } catch (error) {
        // message.error('Error fetching categories');
        if (isMounted && error.response && error.response.status === 500) {
          // If the response status is 401, display an alert and redirect to login page
          alert("Session expired. Please login again.");
          // window.location.href = '/'; // Change the URL accordingly
          navigate("/");
        }
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckboxChange = (categoryName, serviceName) => {
    setSelectedServices((prevState) => {
      const updatedServices = { ...prevState };
      if (
        updatedServices[categoryName] &&
        updatedServices[categoryName].includes(serviceName)
      ) {
        updatedServices[categoryName] = updatedServices[categoryName].filter(
          (item) => item !== serviceName
        );
      } else {
        updatedServices[categoryName] = updatedServices[categoryName]
          ? [...updatedServices[categoryName], serviceName]
          : [serviceName];
      }
      return updatedServices;
    });
  };

  const handleNextButtonClick = () => {
    setPage(2);
  };

  const handleBackButtonClick = () => {
    setPage(1);
  };

  const handleSubmit = async () => {
    try {
      setLoader(true)
      const authToken = localStorage.getItem("token");
      await axios.post(
        "https://sstaxmentors-server.vercel.app/user/addonservice/addNewAddOnService",
        {
          selectedServices: selectedServices,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      message.success("Request sent succesfully");
      setLoader(false)
      setSelectedServices("")
      setDescription("")
      setPage(1);
      // console.log(response.data);
    } catch (error) {
      message.error("Error submitting data");
    }
  };

  return (
    <div>
      <NavigationBar />

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <h2 className="text-3xl font-semibold text-blue-500 mb-10 text-center">
            ADD-ON SERVICES FORM
          </h2>
          <div className="container mx-auto mt-8 p-4  rounded-md">
            {page === 1 && (
              <div>
                {categories.map((category) => (
                  <div key={category.name} className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    {category.subServices.map((service) => (
                      <div key={service} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={service}
                          name={service}
                          checked={
                            selectedServices[category.name] &&
                            selectedServices[category.name].includes(service)
                          }
                          onChange={() =>
                            handleCheckboxChange(category.name, service)
                          }
                          className="mr-2"
                        />
                        <label htmlFor={service}>{service}</label>
                      </div>
                    ))}
                  </div>
                ))}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter description"
                  rows={4}
                />
                <button
                  onClick={handleNextButtonClick}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            )}
            {page === 2 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Selected Services</h3>
                {Object.entries(selectedServices).map(
                  ([category, services]) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-semibold">{category}</h4>
                      <ul>
                        {services.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p>{description}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleBackButtonClick}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                   {loader ? "Loading..." :  "Submit" }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnServicesPage;
