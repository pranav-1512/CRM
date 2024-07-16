import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Upload, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../../../../Custommodal.css";
import NavigationBar from "../../NavigationBar/NavigationBar";

const PaymentSettings = () => {
  const [paymentImage, setPaymentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    const fetchPaymentImage = async () => {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/PaymentQR"
        );
        if (response.data.paymentImages.length > 0) {
          const filename = response.data.paymentImages[0].image.filename;
          setPaymentImage(response.data.paymentImages[0]);
          fetchPaymentImagePreview(filename); // Pass filename to fetchPaymentImagePreview
        }
      } catch (error) {
        setErrorMessage("No payment image");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentImage();
  }, []);

  useEffect(() => {
    if (paymentImage) {
      fetchPaymentImagePreview(paymentImage.filename);
    }
  }, [paymentImage]);

  const fetchPaymentImagePreview = async (filename) => {
    try {
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/getPaymentQRImage",
        {
          responseType: "blob",
          params: { filename }, // Pass filename as a parameter
        }
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);
      setPreviewURL(url);
    } catch (error) {
      // setErrorMessage('Error fetching payment image preview');
    }
  };

  const handlePaymentDelete = async () => {
    try {
      await axios.post("https://sstaxmentors-server.vercel.app/admin/deletePaymentQR");
      setPaymentImage(null);
      setErrorMessage("");
      message.success("Successfully deleted payment image");
    } catch (error) {
      setErrorMessage("Error deleting payment image");
    } finally {
      setConfirmModalVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmModalVisible(false);
  };

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      // message.error(`${info.file.name} file upload failed.`);
    }
    setFile(info.file.originFileObj);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/addPaymentQRImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Payment image uploaded successfully");
      // Refetch payment image after upload
      const response = await axios.get("https://sstaxmentors-server.vercel.app/admin/PaymentQR");
      if (response.data.paymentImages.length > 0) {
        setPaymentImage(response.data.paymentImages[0]);
      }
    } catch (error) {
      setErrorMessage("Error uploading payment image");
    }
  };

  return (
    <div>
      <NavigationBar />

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
            PAYMENT QR SETTINGS{" "}
          </p>
          <div className="mt-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : paymentImage ? (
              <div>
                <div className="flex items-center justify-center mb-2 ">
                  {/* <span className='text-gray-600 text-xl'>Image Name:</span> */}
                  <span className="mr-5">{paymentImage.image.filename}</span>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-red-500 cursor-pointer"
                    onClick={() => setConfirmModalVisible(true)}
                  />
                </div>
                {previewURL && (
                  <div className="flex justify-center">
                    <img
                      src={previewURL}
                      alt="Payment Image Preview"
                      className="max-w-xl max-h-xl"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <Upload 
                  accept="image/*"
                  onChange={handleFileChange}
                  showUploadList={false}
                >
                  <Button >Choose Payment Image</Button>
                  
                </Upload>

                {file && <span className="ml-2">{file.name}</span>}
              
                <Button 
                  type="primary"
                  onClick={handleFileUpload}
                  disabled={!file}
                  // className="ml-2"
                  className={`ml-2 ${file ? 'bg-purple-300' : ''}`}
 
                >
                  Send
                </Button>
              </>
            )}
          </div>
          {/* {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>} */}
        </div>
        {/* Confirmation Modal */}
        <Modal
          title="Confirm Deletion"
          visible={confirmModalVisible}
          onOk={handlePaymentDelete}
          onCancel={handleCancelDelete}
          className="custom-modal"
        >
          <p>Are you sure you want to delete this payment image?</p>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentSettings;
