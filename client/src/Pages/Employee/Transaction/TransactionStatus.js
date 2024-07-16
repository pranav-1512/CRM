import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import AcceptModel from "../../../Components/Accept/index";
import { message } from "antd";



const TransactionStatus = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [modalOpen, setModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  let isMounted = true;
  let navigate = useNavigate();

  useEffect(() => {
    fetchPendingTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchPendingTransactions = async () => {
    try {

      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/transactions/transactions",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pending = response.data.filter(
        (transaction) => transaction.status === "Pending"
      );
      setPendingTransactions(pending);
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
      if (!isMounted && error.response && error.response.status === 401) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  const handleAccept = async (transactionId) => {
    try {
      await updateTransactionStatus(transactionId, "Accepted");
      fetchPendingTransactions();
    } catch (error) {
      console.error("Error accepting transaction:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // const handleAcceptModel = (data) => {
  const handleAcceptModel = () => {
    handleCloseModal();
    // Assuming you have the company ID stored in state or as a parameter
    // const companyId = data._id; // Add the company ID here
    // dispatch(deleteCompanyById(companyId));
  };
  const totalPages = Math.ceil(pendingTransactions.length / itemsPerPage);

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
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    pendingTransactions.length
  );
  // const slicedHistory = pendingTransactions.slice(startIndex, endIndex);

  const handleReject = async (transactionId) => {
    try {
      await updateTransactionStatus(transactionId, "Rejected");
      fetchPendingTransactions();
    } catch (error) {
      console.error("Error rejecting transaction:", error);
    }
  };

  const updateTransactionStatus = async (transactionId, status) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `https://sstaxmentors-server.vercel.app/transactions/updatedstatus`,
        { invoiceNumber: transactionId, status },
        config
      );
      if (response) {
        message.success("Transaction accepted successfully");
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  };

  const handlePreview = async (files, transactionid) => {
    try {
      const authToken = localStorage.getItem("token");
      const filename = files[0].filename; // Access the filename from the first element of the files array

      const response = await axios.get(
        `https://sstaxmentors-server.vercel.app/transactions/preview/${filename}?transactionid=${transactionid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      let contentType = "application/pdf"; // Default content type

      // Check if the filename ends with a known image extension
      if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
        contentType = "image/jpeg"; // Set content type to image/jpeg for images
      }

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Filter transactions based on search query
  const filteredTransactions = pendingTransactions.filter(
    (transaction) =>
      (transaction.invoiceNumber &&
        transaction.invoiceNumber
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (transaction.transactionid &&
        transaction.transactionid
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (transaction.amount &&
        transaction.amount
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (transaction.duedate &&
        transaction.duedate
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (transaction.status &&
        transaction.status
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const slicedHistory = filteredTransactions.slice(startIndex, endIndex);

  return (
    <div>
      <NavigationBar/>
      <hr/>
    <div className="container mx-auto px-4 py-8">
      <p className="font-bold text-3xl text-blue-500 mb-10">
        TRANSACTION STATUS
      </p>
      <div className="border border-gray-300 rounded-md p-4 mb-4">
        <div className="overflow-x-auto">
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 mr-2"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Invoice Number</th>
              <th className="py-2 px-4 border-b">Transaction ID</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">File Preview</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slicedHistory.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  {transaction.invoiceNumber}
                </td>
                <td className="py-2 px-4 border-b">
                  {transaction.transactionid}
                </td>
                <td className="py-2 px-4 border-b">{transaction.amount}</td>
                <td className="py-2 px-4 border-b">
                  {formatDate(transaction.duedate)}
                </td>
                <td className="py-2 px-4 border-b">{transaction.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-500"
                    onClick={() =>
                      handlePreview(
                        transaction.files,
                        transaction.transactionid
                      )
                    }
                  >
                    Preview
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                    onClick={() => {
                      setSelectedTransactionId(transaction.invoiceNumber);
                      setAcceptModalOpen(true);
                    }}
                      >
                      Accept
                    </button>
                    {/* <button
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                      onClick={() => handleReject(transaction.invoiceNumber)}>
                      Reject
                    </button> */}
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
      </div>
    </div>
    {acceptModalOpen && (
      <AcceptModel
        // data={selectedCompany}
        data={selectedTransactionId}
        handleAcceptModel={handleAccept }
        handleCloseModal={() => setAcceptModalOpen(false)}
      />
    )}
    </div>
  );
};

export default TransactionStatus;
