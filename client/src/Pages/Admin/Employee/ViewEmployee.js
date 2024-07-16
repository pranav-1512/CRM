import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";
import { message } from "antd";


function ViewEmployees() {
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("all"); // Added state for filter option
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [confirmationAction, setConfirmationAction] = useState("block");


  useEffect(() => {
    fetchEmployeeData();
  }, [filterOption]); // Updated dependencies

  const totalPages = Math.ceil(employeeData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3; // Number of buttons to display
    const maxPages = Math.min(totalPages, maxButtons);
    const middleButton = Math.ceil(maxPages / 2);
    let startPage = Math.max(1, currentPage - middleButton + 1);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (currentPage > middleButton && totalPages > maxButtons) {
      startPage = Math.min(currentPage - 1, totalPages - maxButtons + 1);
      endPage = Math.min(startPage + maxButtons - 1, totalPages);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button
            onClick={() => paginate(i)}
            className={`page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
              currentPage === i ? "current-page" : ""
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    if (totalPages > maxButtons && endPage < totalPages) {
      buttons.push(
        <li key="ellipsis" className="page-item disabled">
          <span className="page-link bg-blue-500 text-white font-semibold py-2 px-4 rounded">
            ...
          </span>
        </li>
      );
      buttons.push(
        <li key={totalPages} className="page-item">
          <button
            onClick={() => paginate(totalPages)}
            className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, employeeData.length);
  const slicedHistory = employeeData.slice(startIndex, endIndex);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/employee/manageemployee",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployeeData(response.data.employees);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setIsLoading(false);
    }
  };

  // const handleBlock = (employee) => {
  //   setSelectedEmployee(employee);
  //   setIsConfirmationModalOpen(true);
  // };

  const handleBlock = (employee) => {
    setSelectedEmployee(employee);
    setConfirmationAction("block");
    setIsConfirmationModalOpen(true);
  };
  
  const handleUnblock = (employee) => {
    setSelectedEmployee(employee);
    setConfirmationAction("unblock");
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmation = async (confirmation) => {
    setIsConfirmationModalOpen(false);
    if (confirmation === "yes" && selectedEmployee) {
      try {

        const token = localStorage.getItem("token");
        let response;
        if (confirmationAction === "block") {
        response = await axios.post(
          "https://sstaxmentors-server.vercel.app/admin/employee/blockemployee",
          { email: selectedEmployee.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }else if (confirmationAction === "unblock") {
        response =  await axios.post(
          "https://sstaxmentors-server.vercel.app/admin/employee/unblockemployee",
          { email: selectedEmployee.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (response.status === 200) {
        message.success(
          `Client ${
            confirmationAction === "block" ? "blocked" : "unblocked"
          } successfully`
        );
      }

       
        fetchEmployeeData();
      } catch (error) {
        console.error("Error blocking employee:", error);
      }
    }
  };

  // const handleUnblock = async (employee) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //    const response =  await axios.post(
  //       "https://sstaxmentors-server.vercel.app/admin/employee/unblockemployee",
  //       { email: employee.email },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       message.success("Client unblocked successfully");
  //     } else {
  //       message.error("Failed to unblock client");
  //     }
  //     fetchEmployeeData();
  //   } catch (error) {
  //     console.error("Error unblocking employee:", error);
  //   }
  // };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    {!isConfirmationModalOpen === true && <NavigationBar /> }
      <hr></hr>
      <div className="container mx-auto  p-10">
        <p className="font-bold text-3xl text-blue-500 mb-10">EMPLOYEE LIST </p>
        <div className="flex flex-wrap mt-4">
          <div className="mb-4 w-full">
            <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
              <div className="flex justify-between ">
                <div
                  className={`cursor-pointer ${
                    filterOption === "all"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500 hover:text-blue-500"
                  } flex items-center`}
                  onClick={() => handleFilter("all")}
                >
                  <span
                    className={`mr-2 ${
                      filterOption === "all" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    All
                  </span>
                </div>
                <div className="mx-10"></div> {/* Add some space */}
                <div
                  className={`cursor-pointer ${
                    filterOption === "inactive"
                      ? "text-red-500 font-bold"
                      : "text-gray-500 hover:text-red-500"
                  } flex items-center`}
                  onClick={() => handleFilter("inactive")}
                >
                  <span
                    className={`mr-2 ${
                      filterOption === "inactive"
                        ? "border-b-2 border-red-500"
                        : ""
                    }`}
                  >
                    Inactive
                  </span>
                </div>
                <div className="mx-10"></div> {/* Add some space */}
                <div
                  className={`cursor-pointer ${
                    filterOption === "active"
                      ? "text-green-500 font-bold"
                      : "text-gray-500 hover:text-green-500"
                  } flex items-center`}
                  onClick={() => handleFilter("active")}
                >
                  <span
                    className={`mr-2 ${
                      filterOption === "active"
                        ? "border-b-2 border-green-500"
                        : ""
                    }`}
                  >
                    Active
                  </span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 mr-2"
              />
            </div>
          </div>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Serial Number</th>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slicedHistory
                .filter((employee) => {
                  if (filterOption === "all") return true;
                  return employee.status === filterOption;
                })
                .filter((employee) =>
                  `${employee.firstName} ${employee.lastName} ${employee.email}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((employee, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                      {employeeData.length - startIndex - index}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {employee.EmployeeId}
                    </td>
                    <td className="py-2 px-4 border-b">{employee.firstName}</td>
                    <td className="py-2 px-4 border-b">{employee.lastName}</td>
                    <td className="py-2 px-4 border-b">{employee.email}</td>
                    <td className="py-2 px-4 border-b">
                      {employee.Phone_number}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={
                          employee.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {employee.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {employee.status === "active" && (
                        <button
                          onClick={() => handleBlock(employee)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                        >
                          Block
                        </button>
                      )}
                      {employee.status === "inactive" && (
                        <button
                          onClick={() => handleUnblock(employee)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ul className="pagination flex justify-center items-center my-4">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </li>
            {renderPaginationButtons()}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                onClick={() => paginate(currentPage + 1)}
                className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </li>
          </ul>
          {/* Confirmation Modal */}
          {isConfirmationModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-md">
                <p className="text-xl font-semibold mb-4">
                Are you sure you want to {confirmationAction === "block" ? "block" : "unblock"} this client?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleConfirmation("yes")}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleConfirmation("no")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewEmployees;
