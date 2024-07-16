import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../../Pages/User/NavigationBar/NavigationBar";
import { useNavigate } from "react-router-dom";

const UserPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(100);
  let isMounted = true;
  let navigate = useNavigate();

  useEffect(() => {
    fetchUserPaymentHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchUserPaymentHistory = async () => {
    try {
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/userPaymentHistory",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use JWT for authentication
          },
        }
      );
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching user payment history:", error);
      if (!isMounted && error.response && error.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  const totalPagesC = Math.ceil(paymentHistory.length / itemsPerPageC);

  const paginateC = (pageNumber) => {
    setCurrentPageC(pageNumber);
  };

  const renderPaginationButtonsC = () => {
    const buttons = [];
    const maxButtons = 3; // Number of buttons to display
    const maxPages = Math.min(totalPagesC, maxButtons);
    const middleButton = Math.ceil(maxPages / 2);
    let startPage = Math.max(1, currentPageC - middleButton + 1);
    let endPage = Math.min(totalPagesC, startPage + maxPages - 1);

    if (currentPageC > middleButton && totalPagesC > maxButtons) {
      startPage = Math.min(currentPageC - 1, totalPagesC - maxButtons + 1);
      endPage = Math.min(startPage + maxButtons - 1, totalPagesC);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${currentPageC === i ? "active" : ""}`}
        >
          <button
            onClick={() => paginateC(i)}
            className={`page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
              currentPageC === i ? "current-page" : ""
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    if (totalPagesC > maxButtons && endPage < totalPagesC) {
      buttons.push(
        <li key="ellipsis" className="page-item disabled">
          <span className="page-link bg-blue-500 text-white font-semibold py-2 px-4 rounded">
            ...
          </span>
        </li>
      );
      buttons.push(
        <li key={totalPagesC} className="page-item">
          <button
            onClick={() => paginateC(totalPagesC)}
            className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {totalPagesC}
          </button>
        </li>
      );
    }

    return buttons;
  };

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(
    startIndexC + itemsPerPageC,
    paymentHistory.length
  );
  const slicedHistoryC = paymentHistory.slice(startIndexC, endIndexC);

  return (
    <div>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-500">
          YOUR PAYMENT HISTORY
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">SNo</th>
                <th className="px-4 py-2">Invoice Number</th>
                {/* <th className="px-4 py-2">Description</th> */}
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment Made On</th>
                <th className="px-4 py-2">Payment Recorded On</th>
                <th className="px-4 py-2">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {slicedHistoryC.map((payment, index) => (
                <tr
                  key={payment._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-4 py-2">
                    {paymentHistory.length - startIndexC - index}
                  </td>
                  <td className="px-4 py-2">{payment.invoiceNumber}</td>
                  {/* <td className="px-4 py-2">{payment.description}</td> */}
                  <td className="px-4 py-2">{payment.amount}</td>
                  <td className="px-4 py-2">{payment.status}</td>
                  <td className="px-4 py-2">
                    {formatDate(payment.paymentMadeOnDate)}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(payment.paymentRecordedDate)}
                  </td>
                  <td className="px-4 py-2">{payment.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="pagination flex justify-center items-center my-4">
            <li className={`page-item ${currentPageC === 1 ? "disabled" : ""}`}>
              <button
                onClick={() => paginateC(currentPageC - 1)}
                className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </li>
            {renderPaginationButtonsC()}
            <li
              className={`page-item ${
                currentPageC === totalPagesC ? "disabled" : ""
              }`}
            >
              <button
                onClick={() => paginateC(currentPageC + 1)}
                className="page-link bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPaymentHistory;
