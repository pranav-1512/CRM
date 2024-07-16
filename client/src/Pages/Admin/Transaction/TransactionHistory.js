// PaymentHistory.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";

const TransactionHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/transaction/paymentHistory",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log(response.data)
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

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

  const filteredHistory = paymentHistory.filter((payment) => {
    const paymentDate = new Date(payment.paymentMadeOnDate);
    return (
      (!startDate || paymentDate >= new Date(startDate)) &&
      (!endDate || paymentDate <= new Date(endDate))
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paymentHistory.length);
  const slicedHistory = filteredHistory.slice(startIndex, endIndex);

 

  return (
    <div>
      <NavigationBar />
      <hr></hr>
      <div className="container mx-auto p-4">
      <p className="font-bold text-3xl m-5 text-blue-500 mb-10">
          TRANSACTION HISTORY
        </p>
        <div className="flex flex-col md:flex-row justify-end items-end">
          <div className="flex items-center mb-2 md:mb-0">
            <label className="mr-2 font-semibold">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-400 p-2"
            />
          </div>
          <div className="flex items-center md:ml-4">
            <label className="mr-2 font-semibold">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-400 p-2"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">SNo</th>
                <th className="py-2 px-4 border-b">Invoice Number</th>
                {/* <th className="py-2 px-4 border-b">Description</th> */}
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">User Email</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Payment Made On</th>
                <th className="py-2 px-4 border-b">Payment Recorded On</th>
                <th className="py-2 px-4 border-b">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {slicedHistory.map((Payments, index) => (
                <tr
                  key={Payments._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 px-4 border-b">
                    {paymentHistory.length - startIndex - index}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {Payments.invoiceNumber}
                  </td>
                  {/* <td className="py-2 px-4 border-b">{payment.description}</td> */}
                  <td className="py-2 px-4 border-b">{Payments.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {(Payments.payment && Payments.payment.user && Payments.payment.user.email)?Payments.payment.user.email:''}
                  </td>
                  <td className="py-2 px-4 border-b">{Payments.status}</td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(Payments.paymentMadeOnDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(Payments.paymentRecordedDate)}
                  </td>
                  <td className="py-2 px-4 border-b">{Payments.approvedBy}</td>
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
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
