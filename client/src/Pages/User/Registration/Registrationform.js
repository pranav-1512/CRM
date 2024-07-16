import React, { useState } from "react";
// import CompanyInfo from '../../Components/User/CompanyInfo';
import PersonalInfo from "../../../Components/User/PersonalInfo";
import AccountInfo from "../../../Components/User/AccountInfo";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  let navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = async () => {
    console.log("Form submitted:", formData); // Log the form data
    const allFormData = JSON.parse(localStorage.getItem("formData"));
    console.log("All form data:", allFormData);
    // Handle submission to a server or perform other actions

    try {
      await axios.post("https://sstaxmentors-server.vercel.app/user/registration/register", formData);
      message.info("Check your mail inbox, Verify your email");
      const role = localStorage.getItem("role");
      if (role === "user") {
        navigate("/");
      }
      // console.log('Form data sent successfully!');
    } catch (error) {
      message.error("A Client already exists with the email");
    }

    setFormData({});
    setStep(1);
    localStorage.removeItem("formData");
  };

  switch (step) {
    case 1:
      return (
        <PersonalInfo
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      );
    case 2:
      return (
        <AccountInfo
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          submitForm={submitForm}
        />
      );

    default:
      return null;
  }
};

export default RegistrationForm;
