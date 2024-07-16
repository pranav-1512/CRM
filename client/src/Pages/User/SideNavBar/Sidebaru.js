import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  lazy,
  Suspense,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { ChevronFirst, ChevronRight, ChevronDown } from "lucide-react";
import axios from "axios"; // Import axios for API requests
import MyLogo from "../../../Images/Logo.png";

const MyProfile = lazy(() => import("../Profile/MyProfile"));
const AddCompanyForm = lazy(() => import("../Company/AddCompany"));
const CreateSupportTicket = lazy(() => import("../SupportTicket/CreateSupportTicket"));
const MyTickets = lazy(() => import("../SupportTicket/MyTickets"));
const Reminder = lazy(() => import("../Reminder/Reminder"));
const Notifications = lazy(() => import("../Notification/Notifications"));
const GSTNotice = lazy(() => import("../../../Components/User/GSTNotice"));
const ITreturns = lazy(() => import("../Document/ITReturns/ITreturns"));
const GSTReturns = lazy(() => import("../../../Components/User/GSTReturnsUser"));
const GSTRegistration = lazy(() =>
  import("../../../Components/User/GSTRegistration")
);
const ROCfilings = lazy(() => import("../Document/ROCFilings/ROCfilings"));
const CMApreparation = lazy(() => import("../Document/CMA/CMApreparation"));
const Licenses = lazy(() => import("../Document/Licenses/Licences"));
const ViewCompany = lazy(() => import("../Company/ViewCompanies"));
const KYC = lazy(() => import("../Document/KYC/KYC"));
const PaymentHistory = lazy(() =>
  import("../../../Components/User/PaymentHistory")
);
const AddOnServicesPage = lazy(() => import("../AddOnServices/AddOnServices"));
const HomePageUser = lazy(() => import("../Home/HomePageUser"));
const ViewAddOnServices = lazy(() => import("../AddOnServices/ViewAddOnServices"));
const HistoryPage = lazy(() => import("../../../Components/User/HistoryU"));
const Payment = lazy(() => import("../Payment/PendingPayments"));

// Create context for sidebar state
const SidebarContext = createContext();

// UserSidebar component
function UserSidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    closeAllDropdowns(); // Close all dropdowns when toggling sidebar
    setExpanded((prevState) => !prevState);
  };

  const closeAllDropdowns = () => {
    setDropdownOpen(false); // Set the state of dropdown to closed
    // Add similar logic for other dropdowns if needed
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/emailname",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response.data);

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

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/user/logout",
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
    <div>
      <div className="flex">
        <aside
          className={`h-screen fixed top-0 left-0 bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 transition-all ${
            expanded ? "w-72" : "w-16"
          }`}
        >
          <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-3 pb-2 flex justify-between items-center">
              <img
                src={MyLogo}
                className={`overflow-hidden transition-all ${
                  expanded ? "w-60" : "w-0"
                }`}
                alt=""
              />
              <button
                onClick={toggleSidebar}
                className="p-0.5 pl-3 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                {expanded ? <ChevronFirst /> : <ChevronRight />}
              </button>
            </div>

            <SidebarContext.Provider value={{ expanded }}>
              <ul className="flex-1 px-3">{children}</ul>
            </SidebarContext.Provider>
          </nav>
        </aside>
        <div
          className={`flex-1 overflow-y-auto ${expanded ? "pl-72" : "pl-16"}`}
        >
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen bg-white">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePageUser />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/add-company" element={<AddCompanyForm />} />
              <Route path="/view-company" element={<ViewCompany />} />
              <Route path="/add-ticket" element={<CreateSupportTicket />} />
              <Route path="/view-ticket" element={<MyTickets />} />
              <Route path="/reminders" element={<Reminder />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/itreturns" element={<ITreturns />} />
              <Route path="/KYC" element={<KYC />} />
              <Route path="/gstreturns" element={<GSTReturns />} />
              <Route path="/gstnotice" element={<GSTNotice />} />
              <Route path="/gstregistration" element={<GSTRegistration />} />
              <Route path="/rocfilings" element={<ROCfilings />} />
              <Route path="/cma" element={<CMApreparation />} />
              <Route path="/license" element={<Licenses />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/AddOnServices" element={<AddOnServicesPage />} />
              <Route
                path="/viewAddOnServices"
                element={<ViewAddOnServices />}
              />
              <Route path="/historyu" element={<HistoryPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// SidebarItem component
function SidebarItem({ text, icon, to, dropdownItems }) {
  const { expanded } = useContext(SidebarContext);
  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
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
            onClick={toggleDropdown}
            className={`flex items-center w-full py-2 px-3 font-medium rounded-md cursor-pointer transition-all ${
              hovered
                ? "bg-gray-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center">
              {icon && React.cloneElement(icon, { color: "#3c82f6" })}
              <span className={`ml-3 ${expanded ? "block" : "hidden"}`}>
                {text}
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 ml-auto transition-transform transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownOpen && (
            <ul className="relative top-0 mt-2 mx-4 bg-white z-10">
              {dropdownItems.map((item, index) => (
                <li
                  key={index}
                  className="relative group"
                  style={{ marginBottom: "8px" }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  >
                    {item.icon &&
                      React.cloneElement(item.icon, { color: "#3c82f6" })}
                    <span className="ml-3">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <Link
          to={to}
          className={`flex items-center py-2 px-3 font-medium rounded-md cursor-pointer transition-all ${
            hovered
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          }`}
        >
          <div className="flex items-center">
            {icon && React.cloneElement(icon, { color: "#3c82f6" })}
            <span className={`ml-3 ${expanded ? "block" : "hidden"}`}>
              {text}
            </span>
          </div>
        </Link>
      )}
    </li>
  );
}

export { UserSidebar, SidebarItem };
