import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompanyInfo = ({ formData, setFormData, nextStep }) => {
  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      handleCheckboxChange(e);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    let updatedCheckboxes = [...selectedCheckboxes];

    if (checked && !updatedCheckboxes.includes(name)) {
      updatedCheckboxes.push(name);
    } else if (!checked && updatedCheckboxes.includes(name)) {
      updatedCheckboxes = updatedCheckboxes.filter((checkbox) => checkbox !== name);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setFormData({ ...formData, selectedCheckboxes: updatedCheckboxes });
  };

  const saveDataAndProceed = () => {
    localStorage.setItem('formData', JSON.stringify(formData));
    nextStep();
  };

  useEffect(() => {
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    if (storedFormData) {
      setFormData(storedFormData);
      setSelectedCheckboxes(storedFormData.selectedCheckboxes || []);
    }
  }, [setFormData]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">Company Information</h2>
        <label className="block mb-4">
          Company Name:
          <input
            type="text"
            id="companyName"
            name="companyName"
            onChange={handleChange}
            className="border border-gray-400 px-3 py-2 rounded w-full"
          />
        </label>

        <div className="mb-4">
          <label className="block font-bold mb-2">Company type:</label>
          <label className="block mb-2 mt-3">
            <input
              type="checkbox"
              name="Sole Proprietorship Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Sole Proprietorship Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Sole Proprietorship Registration</span>
          </label>
          {/* Add other checkboxes with similar styling */}
          <label className="block mb-2">
            <input
              type="checkbox"
              name="Partnerships Firm Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Partnerships Firm Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Partnerships Firm Registration</span>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="Limited Liability Partnerships"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Limited Liability Partnerships')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Limited Liability Partnerships</span>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="Private Limited Company Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Private Limited Company Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Private Limited Company Registration</span>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="Public Limited Company Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Public Limited Company Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Public Limited Company Registration</span>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="Section 8 Company Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('Section 8 Company Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Section 8 Company Registration</span>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="One Person Company Registration"
              onChange={handleChange}
              checked={selectedCheckboxes.includes('One Person Company Registration')}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">One Person Company Registration</span>
          </label>
        </div>

        <label className="block mb-4">
          Designation:
          <input
            type="text"
            id="designation"
            name="designation"
            onChange={handleChange}
            className="border focus:border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 mt-1 w-full"
          />
        </label>

        <label className="block mb-4">
          Office Number:
          <input
            type="text"
            id="officeNumber"
            name="officeNumber"
            onChange={handleChange}
            className="border focus:border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 mt-1 w-full"
          />
        </label>

        <div className='text-xs'>
          By signing up, you agree to our Terms of Service and Privacy policy
        </div>
        
        {localStorage.getItem('role') === 'user' && (
          <div className='text-blue-500 mt-3'>
            <Link to='/'>
              Already have an account?
            </Link>
          </div>
        )}

        <button
          onClick={saveDataAndProceed}
          className="bg-blue-500 hover:bg-blue-600 w-full mt-8 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyInfo;
