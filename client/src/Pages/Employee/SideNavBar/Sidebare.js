import React, { useContext, createContext, useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { ChevronFirst, ChevronRight, ChevronDown } from "lucide-react";
import axios from "axios";
import MyLogo from "../../../Images/Logo.png";
// import AddClient from "../Admin/AddClient";



const ViewKYC = lazy(() => import("../Document/KYC/ViewKYC"));
const ViewBills = lazy(() => import("../Invoice/InvoiceHistory"));
const AddCompany = lazy(() => import("../Client/AddCompany"));
const AddClient = lazy(() => import("../Client/AddClient"));
const  ViewClient = lazy(() => import("../Client/ViewClient"));
const Notification = lazy(() => import("../Notification/Notification"));
const Reminder = lazy(() => import("../Reminder/Reminder"));
const SupportTicket = lazy(() => import("../SupportTicket/SupportTicket"));
const GSTNoticeE = lazy(() => import("../Document/GSTNotice/SendGSTNotice"));
const GSTreturns = lazy(() => import("../Document/GSTReturns/SendGSTReturns"));
const ITreturns = lazy(() => import("../Document/ITReturns/SendITreturns"));
const SendCMApreparation = lazy(() => import("../Document/CMA/SendCMApreparation"));
const SendNewROCfilings = lazy(() => import("../Document/ROCFilings/SendROCfilings"));
const SendNewLicense = lazy(() => import("../Document/License/SendLicense"));
const HomePage = lazy(() => import("../Home/HomePage"));
const CreatePaymentBill = lazy(() => import("../Invoice/CreateInvoice"));
const AddOnServicePage = lazy(() => import("../AddOnServices/AddOnServices"));
const ViewITReturns = lazy(() => import("../Document/ITReturns/ViewITReturns"));
const ViewGSTReturns = lazy(() => import("../Document/GSTReturns/ViewGSTReturns"));
const ViewGSTNotice = lazy(() => import("../Document/GSTNotice/ViewGSTNotice"));
const ViewROCFilings = lazy(() => import("../Document/ROCFilings/ViewROCFilings"));
const ViewCMAPreparation = lazy(() => import("../Document/CMA/ViewCMAPreparation"));
const ViewLicense = lazy(() => import("../Document/License/ViewLicense"));
const HistoryPage = lazy(() => import("../FileHistory/History"));
const MyProfile = lazy(() => import("../Profile/MyProfile"));
const TransactionHistory = lazy(() => import("../Transaction/TransactionHistory"));
const EmployeeTransactions = lazy(() => import("../Transaction/TransactionStatus"));

const SidebarContext = createContext();

function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/employee/emailname",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setExpanded((prevState) => !prevState);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/employee/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex">
      <aside
        className={`h-screen fixed top-0 left-0 bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 transition-all ${
          expanded ? "w-72" : "w-16"
        }`}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={MyLogo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-60" : "w-0"
              }`}
              alt=""
            />
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronRight />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
      <div className={`flex-1 overflow-y-auto ${expanded ? "pl-72" : "pl-16"}`}>
        <Suspense
          fallback={
            <div className="flex space-x-2 justify-center items-center bg-white h-screen ">
              <span className="sr-only">Loading...</span>
              <div
                className="h-8 w-8 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "-0.3s" }}
              ></div>
              <div
                className="h-8 w-8 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "-0.15s" }}
              ></div>
              <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notificationse" element={<Notification />} />
            <Route path="/reminderse" element={<Reminder />} />
            <Route path="/support-tickete" element={<SupportTicket />} />
            <Route path="/gstreturnse" element={<GSTreturns />} />
            <Route path="/viewgstreturnse" element={<ViewGSTReturns />} />
            <Route path="/createinvoice" element={<CreatePaymentBill />} />
            <Route path="/gstnoticee" element={<GSTNoticeE />} />
            <Route path="/viewgstnoticee" element={<ViewGSTNotice />} />
            <Route path="/itreturnse" element={<ITreturns />} />
            <Route path="/viewitreturnse" element={<ViewITReturns />} />
            <Route path="/cmae" element={<SendCMApreparation />} />
            <Route path="/viewcmae" element={<ViewCMAPreparation />} />
            <Route path="/licensee" element={<SendNewLicense />} />
            <Route path="/viewlicensee" element={<ViewLicense />} />
            <Route path="/rocfilingse" element={<SendNewROCfilings />} />
            <Route path="/viewrocfilingse" element={<ViewROCFilings />} />
            <Route path="/AddOnServices" element={<AddOnServicePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/myprofilee" element={<MyProfile />} />
            <Route path="/viewkyce" element={<ViewKYC />} />
            <Route path="/addcompany" element={<AddCompany />} />
            <Route path="/add-client" element={<AddClient/>} />
            <Route path="/view-client" element={<ViewClient/>} />
            <Route path="/viewbills" element={<ViewBills/>} />

            <Route
              path="/transactionstatus"
              element={<EmployeeTransactions />}
            />
            <Route
              path="/transactionhistory"
              element={<TransactionHistory />}
            />
            {/* <Route path="/AddOnServices"element={<AddOnServicePage/>}/> */}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

function SidebarItem({ text, icon, to, dropdownItems }) {
  const { expanded } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  useEffect(() => {
    if (!expanded) {
      // Close dropdown when sidebar collapses
      setDropdownOpen(false);
    }
  }, [expanded]);

  return (
    <li
      className={`relative group ${expanded ? "my-4" : "my-5"} border-l`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "margin 0.3s" }}
    >
      {dropdownItems ? (
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="flex items-center w-full py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-indigo-50 hover:text-3c82f6 text-gray-600"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {icon && React.cloneElement(icon, { style: { color: "#3c82f6", marginRight: '5px' } })}
                <span className={`ml-3 ${expanded ? "block" : "hidden"}`} style={{ fontSize: '14px' }}>
                  {text}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
          {dropdownOpen && (
            <ul className="relative top-0 mt-2 ml-4 bg-white z-10">
              {dropdownItems.map((item, index) => (
                <li key={index} className="relative group" style={{ marginBottom: '7px' }}>
                  <Link
                    to={item.to}
                    className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-indigo-50 hover:text-3c82f6 text-gray-600 block"
                    
                  >
                    {item.icon && React.cloneElement(item.icon, { style: { color: "#3c82f6" } })}
                    <span className="ml-3" style={{ fontSize: '14px' }}>
                      {item.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <Link
          to={to}
          className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-indigo-50 hover:text-3c82f6 text-gray-600 block"
          
        >
          <div className="flex items-center">
            {icon && React.cloneElement(icon, { style: { color: "#3c82f6" } })}
            <span className={`ml-3 ${expanded ? "block" : "hidden"}`} style={{ fontSize: '14px' }}>
              {text}
            </span>
          </div>
        </Link>
      )}
    </li>
  );
}

export { Sidebar, SidebarItem };

