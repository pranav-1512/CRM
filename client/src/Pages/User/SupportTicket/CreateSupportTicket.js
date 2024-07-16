import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateSupportTicket = () => {
  let navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [questionType, setQuestionType] = useState("general");
  const [issueMessage, setIssueMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const formRef = useRef(null); // Create a ref for the form
  const [loader , setLoader] = useState(false); // Create a ref for the form


  const formik = useFormik({
    initialValues: {
      issueMessage: issueMessage ? issueMessage : "",
      files: [],
    },
    validationSchema: Yup.object({
      issueMessage: Yup.string().required("issueMessage Required"),
      files: Yup.array()
        .min(1, "At least one file is required")
        .test(
          "fileSize",
          "Each file should be less than 10MB",
          (files) => files.every((file) => file.size <= 10 * 1024 * 1024) // 10MB per file
        )
        .test("fileType", "Unsupported file format", (files) =>
          files.every((file) => ["application/pdf"].includes(file.type))
        ),
    }),
    onSubmit: async (values, { resetForm, setFieldValue }) => {
      // console.log("🚀 ~ onSubmit:async ~ values:", values)
      // Handle form submission he
      try {
        setLoader(true)
        setIssueMessage(values.issueMessage);
        const formData = new FormData();
        formData.append("ticketId", ticketId); // Add this line to send ticketId
        formData.append("questionType", questionType);
        formData.append("issueMessage", values.issueMessage);
        files.forEach((file) => {
          formData.append("files", file);
        });
        const response = await axios.post(
          "https://sstaxmentors-server.vercel.app/user/createsupportticket",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // formRef.current.reset();
        fetchTicketId();
        resetForm(); // Reset the form after successful submission
        message.success("support ticket submitted successfully!");
        setLoader(false)

      } catch (error) {
        message.error("support ticket not sent. please try again later");
        console.error("Error creating support ticket:", error);
      }
    },
  });

  useEffect(() => {
    // let isMounted = true;
    // Fetch ticket ID from the backend on component mount
    fetchTicketId();
    // return () => {
    //   isMounted = false;
    // };
  }, []);

  const fetchTicketId = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/user/getticketid",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      console.log(!response);

      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setTicketId(response.data.ticketId);
    } catch (error) {
      console.error("Error fetching ticket ID:", error);
      console.log("error", error.response);
      // console.log("ismounted", isMounted);
      if (error.response && error.response.status === 500) {
        // If the response status is 401, display an alert and redirect to login page
        alert("Session expired. Please login again.");
        // window.location.href = '/'; // Change the URL accordingly
        navigate("/");
      }
    }
  };

  const handleFileChange = (event) => {
    // Set selected files based on file input change
    const fileList = event.target.files;
    setFiles(Array.from(fileList)); // Convert the FileList to an array
  };

  return (
    <div>
      <NavigationBar />

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
          <h2 className="text-3xl font-semibold text-blue-500 mb-10 text-center">
            SUPPORT TICKET FORM
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="container mx-auto mt-8 p-4  rounded-md">
              <div className="mb-4">
                <label className="block font-regular text-lg text-gray-500">
                  Ticket ID:
                </label>
                <input
                  type="text"
                  value={ticketId}
                  readOnly
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block font-regular text-lg text-gray-500">
                  What can we help you with today?
                </label>
                <div>
                  <div>
                    <input
                      type="radio"
                      id="general"
                      name="questionType"
                      value="general"
                      checked={questionType === "general"}
                      onChange={() => setQuestionType("general")}
                    />
                    <label htmlFor="general" className="ml-2 mr-4">
                      General Question
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="bugReport"
                      name="questionType"
                      value="bugReport"
                      checked={questionType === "bugReport"}
                      onChange={() => setQuestionType("bugReport")}
                    />
                    <label htmlFor="bugReport" className="ml-2 mr-4">
                      Bug Report
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="myAccount"
                      name="questionType"
                      value="myAccount"
                      checked={questionType === "myAccount"}
                      onChange={() => setQuestionType("myAccount")}
                    />
                    <label htmlFor="myAccount" className="ml-2 mr-4">
                      My Account
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="other"
                      name="questionType"
                      value="other"
                      checked={questionType === "other"}
                      onChange={() => setQuestionType("other")}
                    />
                    <label htmlFor="other" className="ml-2">
                      Other
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-regular text-lg text-gray-500">
                  Issue/Message:
                </label>
                <textarea
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                  rows="3"
                  value={issueMessage}
                  // onChange={(e) => setIssueMessage(e.target.value)}
                  {...formik.getFieldProps("issueMessage")}
                ></textarea>
                {formik.touched.issueMessage && formik.errors.issueMessage ? (
                  <div className="text-red-500">
                    {formik.errors.issueMessage}
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="block font-regular text-lg text-gray-500">
                  Upload Files(only Pdf Supported):
                </label>
                <input
                  type="file"
                  name="files"
                   id="files"
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.currentTarget.files);
                    setFiles(selectedFiles);
                    formik.setFieldValue("files", selectedFiles);
                  }}
                  // onChange={handleFileChange}
                  accept="application/pdf"
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                {formik.touched.files && formik.errors.files ? (
                  <div style={{ color: "red" }}>{formik.errors.files}</div>
                ) : null}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {loader ? "Loading..." : "Submit"}
                </button>
               
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupportTicket;
