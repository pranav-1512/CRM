import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import { useState,lazy,Suspense } from "react";
import Registrationform from "./Pages/User/Registration/Registrationform";
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
// import Thankyou from "./Pages/Thankyou";
import Homepage from './Pages/Homepage'

const Login = lazy(()=> import("./Pages/Login"));
const DashboardUser = lazy(()=> import("./Pages/User/SideNavBar/Dashboard"));
const DashboardAdmin = lazy(()=> import("./Pages/Admin/SideNavBar/Dashboard"));
const DashboardEmployee = lazy(()=> import("./Pages/Employee/SideNavBar/DashboardE"));
const SupportTicketDetails = lazy(()=> import("./Components/Admin/SupportTicketDetails"));
const SupportTicketDetailsE = lazy(()=> import("./Components/Employee/SupportTicketDetails"));
const ITDetailsInNewTab = lazy(()=> import("./Components/Admin/ITReturnsDetails"));
const GSTNoticeDetailsInNewTab = lazy(()=> import("./Components/Admin/GSTNoticeDetails"));
const GSTReturnDetailsInNewTab = lazy(()=> import("./Components/Admin/GSTReturnsDetails"));
const ROCDetailsInNewTab = lazy(()=> import("./Components/Admin/ROCDetails"));
const LicenseDetailsInNewTab = lazy(()=> import("./Components/Admin/LicenseDetails"));
const CMADetailsInNewTab = lazy(()=> import("./Components/Admin/CMADetails"));
const NotificationDetailsInNewTab = lazy(()=> import("./Components/Admin/NotificationDetails"));
const ReminderDetailsInNewTab = lazy(()=> import("./Components/Admin/ReminderDetails"));
const AddOnServiceDetailsInNewTab = lazy(()=> import("./Components/Admin/AddOnServiceDetails"));
const SupportTicketDetailsInNewTab  = lazy(()=> import("./Components/Admin/STDetails"));
const ClientDetailsInNewTab  = lazy(()=> import("./Components/Admin/ViewClientDetails"));
const Verify  = lazy(()=> import("./Pages/Admin/EmailVerification/Verify"));


function App() {
  const [activeComponent, setActiveComponent] = useState("");

  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };
  return (
    <div className="App">
       <Suspense fallback = {<div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
      <span className='sr-only'>Loading...</span>
      <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '-0.3s'}}></div>
      <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '-0.15s'}}></div>
      <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce'></div>
    </div>}>

      <Routes>
        <Route path="/register" element={<Registrationform/>}></Route>
        {/* <Route path="/" element={<Login/>}></Route> */}
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        {/* <Route path="/thankyou" element={<Thankyou/>}></Route> */}
        <Route path="/user/userdashboard/*" element={<DashboardUser/>}></Route>
        <Route path="/admin/admindashboard/*" element={<DashboardAdmin/>}></Route>
        <Route path="/employee/employeedashboard/*" element={<DashboardEmployee/>}></Route>
        <Route path="/login/reset-password" element={<ResetPassword />} />
        <Route path="/support-ticket-details/:ticketId" element={<SupportTicketDetails/>}></Route>
        <Route path="/support-ticket-detailse/:ticketId" element={<SupportTicketDetailsE/>}></Route>
        <Route path="/itdetails" element={<ITDetailsInNewTab/>} />
        <Route path="/gstnotice" element={<GSTNoticeDetailsInNewTab/>} />
        <Route path="/gstreturns" element={<GSTReturnDetailsInNewTab/>} />
        <Route path="/roc" element={<ROCDetailsInNewTab/>} />
        <Route path="/license" element={<LicenseDetailsInNewTab/>} />
        <Route path="/cma" element={<CMADetailsInNewTab/>} />
        <Route path="/notification" element={<NotificationDetailsInNewTab/>} />
        <Route path="/reminder" element={<ReminderDetailsInNewTab/>} />
        <Route path="/addonservice" element={<AddOnServiceDetailsInNewTab/>} />
        <Route path="/supportticket" element={<SupportTicketDetailsInNewTab/>} />
        <Route path="/viewclient" element={<ClientDetailsInNewTab/>} />
        <Route path="/admin/verify" element={<Verify/>} />
        <Route path="/user/verify" element={<Verify/>} />

      </Routes>
      
       </Suspense>
    </div>
  );
}

export default App;
