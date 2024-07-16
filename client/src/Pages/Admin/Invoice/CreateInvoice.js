import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";

const CreatePaymentBill = () => {
  const [clients, setClients] = useState([]);
  const [filteredClientData, setFilteredClientData] = useState([]);

  const [selectedClient, setSelectedClient] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [subServices, setSubServices] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [dueDate, setDueDate] = useState("");

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseData, setResponseData] = useState({});
  const [invoiceId, setInvoiceId] = useState("");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [currentPageClient, setCurrentPageClient] = useState(1);
  const [itemsPerPageClient] = useState(15);
  const [showForm, setShowForm] = useState(false);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [itemsPerPageC, setItemsPerPageC] = useState(50);

  const [loader, setLoader] = useState(false);

  useEffect(() => {

    fetchClients();
  }, []);
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token") 
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/client/getClients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("🚀 ~ fetchClients ~ response:", response)
        setClients(response.data);
      } catch (error) {
        setErrorMessage("Error fetching clients");
      }
    };


  const formik = useFormik({
    initialValues: {
      invoiceId: "",
      company: "",
      service: "",
      subService: "",
      amount: amount ? amount : "",
      dueDate: "",
      description: description ? description : "",
      files: [],
    },
    validationSchema: Yup.object({
      company: Yup.string().required("Select a company"),
      service: Yup.string().required("Select a service"),
      subService: Yup.string().required("Select a sub-service"),
      amount: Yup.number()
        .required("Enter the amount")
        .positive("Amount must be positive"),
        files: Yup.array()
        .min(1, 'At least one file is required')
        .test(
          'fileSize',
          'Each file should be less than 4MB',
          files => files.every(file => file.size <= 4 * 1024 * 1024) // 4MB per file
        )
        .test(
          'fileType',
          'Unsupported file format',
          files => files.every(file => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type))
        ),
    }),
    onSubmit: async(values, { resetForm, setFieldValue }) => {
      // Handle form submission her
        try {
          setSelectedCompany(values.company);
          setSelectedService(values.service);
          setSelectedSubService(values.subService);
          setAmount(values.amount);
          setDueDate(values.dueDate);
          setDescription(values.description);
    
          const formData = new FormData();
       
          formData.append("invoiceId", invoiceId);
          formData.append("email", selectedClient);
          formData.append("companyName", values.company);
          formData.append("service", values.service);
          formData.append("subService", values.subService);
          formData.append("amount", values.amount);
          formData.append("due", values.dueDate);
          formData.append("description",values.description); // Adding description to form data
    
          // for (let i = 0; i < values.length; i++) {
            formData.append("file",files);
          // }
    
          
          const token =
            localStorage.getItem("token") 
            setLoader(true);
    
          await axios.post(
            "https://sstaxmentors-server.vercel.app/admin/invoice/generateBill",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          const formData2 = new FormData();
          formData2.append("title", "Reminder for Payment");
    
          // Constructing the description
          const formattedDueDate = new Date(dueDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const reminderDescription = `Please pay the bill before the due date: ${formattedDueDate}. 
                Service: ${selectedService}, Sub-service: ${selectedSubService}, Amount: ${amount}`;
    
          formData2.append("description", reminderDescription);
    
          // for (let i = 0; i < files.length; i++) {
            formData2.append("file", files);
          // }
    
          formData2.append("selectedClients", JSON.stringify(selectedClient));
    
          await axios.post(
            "https://sstaxmentors-server.vercel.app/admin/reminder/sendreminder",
            formData2,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (selectedService === "IT") {
            const formData3 = new FormData();
            formData3.append("description", values.description);
            formData3.append("remarks", "---");
            formData3.append("selectedCompany", selectedCompany);
            formData3.append("selectedReturnType", values.subService);
    
            for (let i = 0; i < files.length; i++) {
              formData3.append("file", files[i]);
            }
    
            formData3.append("selectedClient", JSON.stringify(selectedClient));
    
            // const token = localStorage.getItem('token');
    
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/itreturns/sendITreturns",
              formData3,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else if (selectedService === "GSTReturns") {
            const dataForBackend = new FormData();
            dataForBackend.append("selectedClient", selectedClient);
            dataForBackend.append("selectedCompany", selectedCompany);
            dataForBackend.append("selectedReturnType", values.subService);
            dataForBackend.append("description", values.description);
            dataForBackend.append("remarks", "---");
            for (let i = 0; i < files.length; i++) {
              dataForBackend.append("file", files[i]);
            }
    
            // dataForBackend.append('file', file);
    
            // const token = localStorage.getItem('token');
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/gstreturns/sendGSTreturns",
              dataForBackend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else if (selectedService === "GSTNotice") {
            const dataForBackend = new FormData();
            dataForBackend.append("selectedClient", selectedClient);
            dataForBackend.append("selectedCompany", selectedCompany);
            dataForBackend.append("selectedNoticeType", values.subService);
            dataForBackend.append("description", values.description);
            dataForBackend.append("remarks", "---");
            // dataForBackend.append('file', file);
            for (let i = 0; i < files.length; i++) {
              dataForBackend.append("file", files[i]);
            }
    
            const token =
              localStorage.getItem("token") 
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/gstreturns/sendGSTnotice",
              dataForBackend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else if (selectedService === "ROC") {
            const dataForBackend = new FormData();
            dataForBackend.append("clientEmail", selectedClient);
            dataForBackend.append("company", selectedCompany);
            dataForBackend.append("rocFieldName", values.subService);
            dataForBackend.append("description", values.description);
            dataForBackend.append("remarks", "---");
            // dataForBackend.append('file', file);
            for (let i = 0; i < files.length; i++) {
              dataForBackend.append("file", files[i]);
            }
    
            // try {
            const token =
              localStorage.getItem("token") 
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/rocfilings/sendNewROCfilings",
              dataForBackend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else if (selectedService === "CMA") {
            const dataForBackend = new FormData();
            dataForBackend.append("clientEmail", selectedClient);
            dataForBackend.append("company", selectedCompany);
            dataForBackend.append("cmaPreparationTypeName", values.subService);
            dataForBackend.append("description", values.description);
            dataForBackend.append("remarks", "---");
            // dataForBackend.append('file', file);
            for (let i = 0; i < files.length; i++) {
              dataForBackend.append("file", files[i]);
            }
    
            const token =
              localStorage.getItem("token") 
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/cma/sendNewCMApreparation",
              dataForBackend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else if (selectedService === "Licenses") {
            const dataForBackend = new FormData();
            dataForBackend.append("clientEmail", selectedClient);
            dataForBackend.append("company", selectedCompany);
            dataForBackend.append("licenseTypeName", values.subService);
            dataForBackend.append("description", values.description || "Licenses");
            dataForBackend.append("remarks", "---");
            // dataForBackend.append('file', values.file);
            for (let i = 0; i < files.length; i++) {
              dataForBackend.append("file", files[i]);
            }
    
            const token =
              localStorage.getItem("token") 
            await axios.post(
              "https://sstaxmentors-server.vercel.app/admin/document/license/addNewLicense",
              dataForBackend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          }
          setErrorMessage("");
          resetForm();
          setFieldValue('dueDate', values.dueDate);
          message.success("Invoice Sent successfully!");
  
          setLoader(false);
          setShowInvoiceForm(false); // Set showForm state to false to hide the form
          fetchClients()
          fetchInvoiceId()
    
        } catch (error) {
          message.error("Failed to sent Invoice.please try again later");
          setErrorMessage("Error creating payment bill");
          setLoader(false);
        }
      },
    });

  // const handleFileChange = (event) => {
  //   console.log(event.target.files);
  //   formik.setFieldValue("files", event.target.files);
  //   // setFiles(event.target.files);
  // };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };


  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

  useEffect(() => {
    // Set due date to 15 days from now
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDate.toISOString().split("T")[0];
    setDueDate(formattedDueDate);
  }, []);
  const toDay = moment().format("MM DD YYYY");
  const dueDateMoment = moment(dueDate);
  const differenceInDays = dueDateMoment.diff(moment(toDay), "days");

  useEffect(() => {

    fetchInvoiceId();
  }, []);
    const fetchInvoiceId = async () => {
      try {
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/invoice/getInvoiceId"
        );
        setInvoiceId(response.data.invoiceId);
      } catch (error) {
        setErrorMessage("Error fetching invoice ID");
      }
    };

 

  const totalPagesC = Math.ceil(clients.length / itemsPerPageC);

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

  useEffect(() => {
    filterClientData();
  }, [clients, searchQuery, filterOption]); // Updated dependencies


  const filterClientData = () => {
    let filteredClients = clients.filter((client) => {
      const fullName = `${client.firstname} ${client.lastname}.toLowerCase()`;
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (filterOption !== "all") {
      filteredClients = filteredClients.filter(
        (client) => client.status === filterOption
      );
    }

    setFilteredClientData(filteredClients);
  };

  const startIndexC = (currentPageC - 1) * itemsPerPageC;
  const endIndexC = Math.min(startIndexC + itemsPerPageC, filteredClientData.length);
  const slicedHistoryC = filteredClientData.slice(startIndexC, endIndexC);

  // const startIndexC = (currentPageC - 1) * itemsPerPageC;
  // const endIndexC = Math.min(startIndexC + itemsPerPageC, clients.length);
  // const slicedHistoryC = clients.slice(startIndexC, endIndexC);

  useEffect(() => {
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDate.toISOString().split("T")[0];
    setDueDate(formattedDueDate);
    formik.setFieldValue("dueDate", formattedDueDate);
  }, []);

  const handleClientChange = async (clientEmail) => {
    setSelectedClient(clientEmail);
    try {
      const token = localStorage.getItem("token") 
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/client/getCompanyNamesOfClient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            clientEmail: clientEmail,
          },
        }
      );
      setCompanies(response.data);
      setClientDetails(null);
      setShowInvoiceForm(true);
    } catch (error) {
      setErrorMessage("Error fetching companies");
    }
  };

  const handleCompanyChange = async (event) => {
    setSelectedCompany(event.target.value);
    formik.setFieldValue("company", event.target.value);

    try {
      const response = await axios.get(
        "https://sstaxmentors-server.vercel.app/admin/transaction/getServiceAndSubServiceDetailsForPayment"
      );
      setServices(Object.keys(response.data)); // Populate services dropdown with service names
      setResponseData(response.data);
      setCompanyDetails(null);
    } catch (error) {
      setErrorMessage("Error fetching services");
    }
  };

  const handleServiceChange = async (event) => {
    setSelectedService(event.target.value);
    formik.setFieldValue("service", event.target.value);
    console.log(event.target.value);
    const selectedServiceData = responseData[event.target.value]; // Access responseData
    if (selectedServiceData) {
      setSubServices(
        selectedServiceData
          .filter((returnType) => returnType.status === "active")
          .map((subService) => subService.name)
      );
    }
  };

 

  // Function to fetch and set client details
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(
          `https://sstaxmentors-server.vercel.app/admin/getClientDetails/${selectedClient}`
        );
        setClientDetails(response.data);
      } catch (error) {
        setErrorMessage("Error fetching client details");
      }
    };

    if (selectedClient) {
      fetchClientDetails();
    }
  }, [selectedClient]);

  // Function to fetch and set company details
  // useEffect(() => {
  //   const fetchCompanyDetails = async () => {
  //     try {
  //       console.log(selectedCompany);
  //       const response = await axios.get(
  //         `https://sstaxmentors-server.vercel.app/admin/getCompanyNameOnlyDetailsAdmin/${selectedCompany}`
          
  //       );
  //       setCompanyDetails(response.data);
  //     } catch (error) {
  //       setErrorMessage("Error fetching company details");
  //     }
  //   };

  //   if (selectedCompany) {
  //     fetchCompanyDetails();
  //   }
  // }, [selectedCompany]);

  // const filteredClients = clients
  //   .filter((client) => {
  //     if (filterOption === "all") {
  //       return true;
  //     }
  //     return client.status === filterOption;
  //   })
  //   .filter((client) => {
  //     const fullName = `${client.firstname} ${client.lastname}`.toLowerCase();
  //     return (
  //       fullName.includes(searchQuery.toLowerCase()) ||
  //       client.email.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });

  const paginateClients = (pageNumber) => {
    setCurrentPageClient(pageNumber);
  };

  const handleBackButtonClick = () => {
    setShowInvoiceForm(false); // Set showForm state to false to hide the form
  };

  // const indexOfLastClient = currentPageClient * itemsPerPageClient;
  // const indexOfFirstClient = indexOfLastClient - itemsPerPageClient;
  // const currentClients = filteredClients.slice(
  //   indexOfFirstClient,
  //   indexOfLastClient
  // );

  return (
    <div>
      <NavigationBar />
      <hr></hr>

      <div className="container flex justify-center items-center p-10">
        {showInvoiceForm ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md mt-8 mb-8">
              {/* <div className="max-w-2xl  w-full bg-white p-8 rounded-md shadow-md"> */}
              <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
                CREATE PAYMENT BILL{" "}
              </p>
              {/* {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} */}

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="invoiceId"
                >
                  Invoice ID:
                </label>
                <input
                  type="text"
                  id="invoiceId"
                  value={invoiceId}
                  readOnly
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />
              </div>
              {/* Rest of the form */}
              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="company"
                >
                  Select Company:
                </label>
                <select
                  id="company"
                  {...formik.getFieldProps("company")}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                  onChange={handleCompanyChange}
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                {formik.touched.company && formik.errors.company ? (
                  <div className="text-red-500">{formik.errors.company}</div>
                ) : null}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="service"
                >
                  Select Service:
                </label>
                <select
                  id="service"
                  {...formik.getFieldProps("service")}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                  onChange={handleServiceChange}
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {formik.touched.service && formik.errors.service ? (
                  <div className="text-red-500">{formik.errors.service}</div>
                ) : null}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="subService"
                >
                  Select Sub-service:
                </label>
                <select
                  id="subService"
                  {...formik.getFieldProps("subService")}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                >
                  <option value="">Select Sub-service</option>
                  {subServices.map((subService) => (
                    <option key={subService} value={subService}>
                      {subService}
                    </option>
                  ))}
                </select>
                {formik.touched.subService && formik.errors.subService ? (
                  <div className="text-red-500">{formik.errors.subService}</div>
                ) : null}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="amount"
                >
                  Amount:
                </label>
                <input
                  type="text"
                  id="amount"
                  {...formik.getFieldProps("amount")}
                  placeholder="Enter amount"
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />
                {formik.touched.amount && formik.errors.amount ? (
                  <div className="text-red-500">{formik.errors.amount}</div>
                ) : null}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="dueDate"
                >
                  Due Date: {differenceInDays} Days
                </label>
                <input
                  type="date"
                  id="dueDate"
                  {...formik.getFieldProps("dueDate")}
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />
                {formik.touched.dueDate && formik.errors.dueDate ? (
                  <div className="text-red-500">{formik.errors.dueDate}</div>
                ) : null}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="description"
                >
                  Description:
                </label>
                <textarea
                id="description"
                {...formik.getFieldProps("description")}
                // onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="border border-gray-200 rounded px-4 py-2 resize-y focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full h-36"
                style={{ width: "100%" }}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500">{formik.errors.description}</div>
              ) : null}
            </div>

              <div className="mb-6">
                <label
                  className="block text-gray-500 text-lg mb-2"
                  htmlFor="files"
                >
                  Upload Files:
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
                  multiple
                  className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 w-full"
                />

                {formik.touched.files && formik.errors.files ? (
                  <div style={{ color: 'red' }}>{formik.errors.files}</div>
                ) : null}

              </div>

              <div className="flex justify-center items-center mt-12">
                <button
                  className="inline-block w-56 mr-5 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  type="button"
                  onClick={handleBackButtonClick} // Call handleBackButtonClick function on click
                >
                  Back
                </button>

                <button
                  className="inline-block w-56 rounded px-6 pb-2 pt-2.5 leading-normal text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:from-blue-600 focus:to-blue-800 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:from-blue-700 active:to-blue-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  type="submit"
                >
                  {loader ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap mt-4">
            {/* <div className="max-w-2xl  w-full bg-white p-8 rounded-md shadow-md"> */}
            <p className="font-bold text-3xl flex justify-center text-blue-500 mb-10">
              CREATE INVOICE{" "}
            </p>
            <div className="mb-4 w-full">
              <div className="flex justify-between border border-t-3 border-b-3 border-gray-200 p-5">
                <div className="flex justify-between">
                  {/* Filter options */}
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
                        filterOption === "all"
                          ? "border-b-2 border-blue-500"
                          : ""
                      }`}
                    >
                      All
                    </span>
                  </div>
                  <div className="mx-10"></div>
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
                  <div className="mx-10"></div>
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
                  <th className="py-2 px-4 border-b">S No</th>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone Number</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slicedHistoryC.map((client, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                      {filteredClientData.length - startIndexC - index}
                    </td>
                    <td className="py-2 px-4 border-b">{client.firstname}</td>
                    <td className="py-2 px-4 border-b">{client.lastname}</td>
                    <td className="py-2 px-4 border-b">{client.email}</td>
                    <td className="py-2 px-4 border-b">
                      {client.Phone_number}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={
                          client.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleClientChange(client.email)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center my-4">
              <ul className="pagination flex justify-center items-center my-4">
                <li
                  className={`page-item ${
                    currentPageC === 1 ? "disabled" : ""
                  }`}
                >
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
        )}
      </div>
    </div>
  );
};

export default CreatePaymentBill;
