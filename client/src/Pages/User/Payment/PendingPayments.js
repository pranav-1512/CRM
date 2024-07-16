import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";
import moment from "moment";

const PendingPayment = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [fileList, setFileList] = useState([]);
  const [qrCodeSrc, setQRCodeSrc] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  let isMounted = true;

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const userResponse = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/profile/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const billResponse = await axios.post(
        "https://sstaxmentors-server.vercel.app/user/payment/viewBill",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (billResponse.data.temp && billResponse.data.temp.length > 0) {
        const newOrders = billResponse.data.temp.map((bill) => ({
          _id: bill._id,
          invoiceId: bill.invoiceId,
          amount: bill.amount,
          ispaid: bill.ispaid,
          receipt: "receipt#" + bill._id,
          duedate: bill.duedate,
          description: bill.description,
          paymentMethod: bill.paymentMethod,

          remainingTime: calculateRemainingTime(bill.duedate),
        }));
        setOrders(newOrders);
        // console.log(newOrders)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!isMounted && error.response && error.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchQRCode();
  }, [selectedOrder]); // Fetch QR code when selected order changes

  const fetchQRCode = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (selectedOrder) {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/settings/payment/getPaymentQRImageUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQRCodeSrc(response.data.imageSrc);
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    }
  };
  // Function to calculate remaining time
  const calculateRemainingTime = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    if (diff <= 0) {
      return "Expired";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    return `${days}d ${hours}h`;
  };

  const handlePay = (order) => {
    setSelectedOrder(order);
    setAmountPaid(order.amount);
    setShowPaymentStatus(false);
    const modal = document.getElementById("qrCodeModal");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
    }
  };

  const handleProceed = () => {
    setShowPaymentStatus(true);
  };

  const handleCancel = () => {
    const modal = document.getElementById("qrCodeModal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
    }
    setSelectedOrder(null);
    setShowPaymentStatus(false);
    setPaymentStatus("");
    setTransactionId("");
    setAmountPaid("");
    setPaymentMethod("");
    setFileList([]);
  };

  const handleDone = () => {
    const modal = document.getElementById("qrCodeModal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
    }
    setSelectedOrder(null);
    setShowPaymentStatus(false);
    setPaymentStatus("");
    setTransactionId("");
    setAmountPaid("");
    setPaymentMethod("");
    setFileList([]); // Clear the fileList state
  };

  const handleSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (paymentStatus === "success") {
        if (
          !transactionId ||
          !amountPaid ||
          !paymentMethod ||
          fileList.length === 0
        ) {
          message.error(
            "Please provide transaction ID, amount paid, and upload file"
          );
          return;
        }
        
        const formData = new FormData();
        formData.append("invoiceNumber", selectedOrder.invoiceId);
        formData.append("transactionId", transactionId);

        formData.append("amountPaid", selectedOrder?.amount);
        formData.append("duedate", selectedOrder.duedate);
        formData.append("description", selectedOrder.description);
        formData.append("payment", selectedOrder._id);
        // formData.append("payment", selectedOrder._id);
        formData.append("paymentMethod", paymentMethod);

        fileList.forEach((file) => {
          formData.append("files", file.originFileObj);
        });
        
        setLoader(true)
        const response = await axios.post(
          "https://sstaxmentors-server.vercel.app/user/payment/insertTransaction",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
   
        handleDone();
        message.success("Transaction submitted successfully");
        setLoader(false)
        // window.location.reload();
      } else if (paymentStatus === "failure") {
        message.error("Try Again");
        setShowPaymentStatus(false);
        setLoader(false)
        setSelectedOrder(selectedOrder);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("something wrong");
      setLoader(false)
    }
  };

  // const unpaidBills = orders.filter((order) => !order.isPaid);
  const unpaidBills = [];

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].ispaid == false) {
      unpaidBills.push(orders[i]);
    }
  }

  const totalPagesC = Math.ceil(unpaidBills.length / itemsPerPageC);

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
  const endIndexC = Math.min(startIndexC + itemsPerPageC, unpaidBills.length);
  const slicedHistoryC = unpaidBills.slice(startIndexC, endIndexC);
  // console.log("slicedHistoryC: ", slicedHistoryC);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="bg-gray-100">
      <NavigationBar />

      <div className="m-3 ">
        <p className="font-bold text-3xl text-blue-500 m-10">BILLS TO PAY</p>
        <hr className="m-10"></hr>

        <div className="w-full gap-4">
          {slicedHistoryC
            .sort((a, b) => b.invoiceId.localeCompare(a.invoiceId))
            .map((order, index) => {
              // Format the due date using moment.js
              const formattedDueDate = moment(order.duedate).format("L");

              // Truncate the description if it's too long
              let truncatedDescription = order.description;
              if (!showFullDescription && order.description.length > 50) {
                truncatedDescription =
                  order.description.substring(0, 50) + "...";
              }
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg my-5 shadow-md p-6 grid grid-cols-2"
                >
                  <div className="pr-4">
                    <p className="text-2xl font-bold">
                      Invoice Id:{" "}
                      <span className="text-gray-600">{order.invoiceId}</span>
                    </p>
                    <p className="text-gray-600">
                      Remaining Time: {order.remainingTime}
                    </p>
                    <p className="text-gray-600">
                      Due Date: {formattedDueDate.substring(0, 10)}
                    </p>
                    <button
                      className="bg-blue-500 text-white py-2 px-10 rounded mt-4"
                      onClick={() => handlePay(order)}
                    >
                      Pay
                    </button>
                  </div>
                  <div className="border-l-2 border-gray-200 pl-4">
                    <p className="text-xl font-semibold">
                      Amount: {order.amount}
                    </p>
                    {/* <p className="text-gray-600">Receipt: {order.receipt}</p> */}

                    <p className="text-gray-600 overflow-auto break-words">
                      Description:
                      {showFullDescription
                        ? order.description
                        : truncatedDescription}
                    </p>
                    {order.description.length > 50 && (
                      <button
                        className="text-blue-500 mt-2"
                        onClick={toggleDescription}
                      >
                        {showFullDescription ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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

        {selectedOrder && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex gap-2 items-center">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4H18a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2zm3-9a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 8a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"
                            />
                          </svg>
                        </div>
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          Amount to be paid:{" "}
                          {selectedOrder ? selectedOrder.amount : ""}
                        </h3>
                      </div>
                      <div className="mt-2 sm:flex lg:justify-evenly">
                        <div className="mt-2 sm:mt-0 sm:ml-4">
                          <div className="mb-3">
                            <label
                              htmlFor="paymentStatus"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Payment Status
                            </label>
                            <select
                              className="mt-1 block w-full border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              id="paymentStatus"
                              onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                              <option value="">Select</option>
                              <option value="success">Success</option>
                              <option value="failure">Failure</option>
                            </select>
                          </div>
                          {paymentStatus === "success" && (
                            <>
                              <div className="mb-3">
                                <label
                                  htmlFor="transactionId"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Transaction ID
                                </label>
                                <input
                                  type="text"
                                  className="w-full mt-1 block py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm placeholder-gray-400 focus:placeholder-gray-500"
                                  id="transactionId"
                                  value={transactionId}
                                  onChange={(e) =>
                                    setTransactionId(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="amountPaid"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Amount Paid
                                </label>
                                <input
                                  type="text"
                                  className="w-full mt-1 block py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm placeholder-gray-400 focus:placeholder-gray-500"
                                  id="amountPaid"
                                  value={amountPaid}
                                  onChange={(e) =>
                                    setAmountPaid(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex items-center">
                                <label className="mr-2">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Google Pay"
                                    checked={paymentMethod === "Google Pay"}
                                    onChange={(e) =>
                                      setPaymentMethod(e.target.value)
                                    }
                                  />
                                  Google Pay
                                </label>
                                <label className="mr-2">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Phone Pay"
                                    checked={paymentMethod === "Phone Pay"}
                                    onChange={(e) =>
                                      setPaymentMethod(e.target.value)
                                    }
                                  />
                                  Phone Pe
                                </label>

                                <label>
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Paytm"
                                    checked={paymentMethod === "Paytm"}
                                    onChange={(e) =>
                                      setPaymentMethod(e.target.value)
                                    }
                                  />
                                  Paytm
                                </label>
                              </div>

                              <div className="mb-3 mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Upload the Proof
                                </label>
                                <Upload
                                  fileList={fileList}
                                  onChange={({ fileList }) =>
                                    setFileList(fileList)
                                  }
                                  beforeUpload={() => false}
                                >
                                  <Button
                                    className="mt-1"
                                    icon={<UploadOutlined />}
                                  >
                                    Select File
                                  </Button>
                                </Upload>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="sm:flex-shrink-0">
                          <img
                            src={qrCodeSrc}
                            alt="QR Code"
                            className="mx-auto sm:mx-0 sm:mb-4 w-40 h-40"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="bg-blue-500 text-white py-2 px-4 rounded ml-3"
                          onClick={handleSubmit}
                        >
                          {loader ? "Processing..." : "Proceed"}
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white py-2 px-4 rounded"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayment;
