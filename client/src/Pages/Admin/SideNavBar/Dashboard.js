


import React, { useState } from 'react';
import { LayoutDashboard,Bell,Ticket,CircleUser,ScanBarcode,ReceiptIndianRupee,UserPlus,UserMinus,BadgePlus, User,StickyNote,Files,Settings,History} from "lucide-react";
import { Sidebar, SidebarItem } from "./Sidebar";
const Dashboard = () => {
  
  return (
    <div>
      <div>
      <Sidebar>
      <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              to=""
              active
       />

            <SidebarItem
              icon={<User size={20}/>}
              text="Clients"
              dropdownItems={[
                { text: "Add Clients", icon:<UserPlus />,to: "add-client" },
                { text: "View Clients", icon:<UserMinus />, to: "view-client" },
                { text: "Add Company", icon:<UserMinus />, to: "addcompany" }
                // { text: "View Clients", icon:<UserMinus />, to: "view-client" }
              ]}
            />

            <SidebarItem
               icon={<CircleUser size={20}/>}
              text="Employee"
              dropdownItems={[
                { text: "Add Employee", icon:<UserPlus />, to: "add-employee" },
                { text: "View Employee",icon:<UserMinus />, to: "view-employee" },
                { text: "Employee Attendance",icon:<UserMinus />, to: "employeeattendance" }
              ]}
            />
        <SidebarItem
              icon={<Bell size={20} />}
              text="Notification"
              to="notificationsa"
              
       /> 
         <SidebarItem
              icon={<StickyNote size={20} />}
              text="Reminder"
              to="remindersa"
              
       />
         <SidebarItem
              icon={<Ticket  size={20} />}
              text="Support Ticket"
              to="support-ticketa"
              
          />
          <SidebarItem
              icon={<ReceiptIndianRupee size={20}/>}
              text="Invoices"
              dropdownItems={[
                { text: "Create Invoice", to: "createinvoice" },
                { text: "Invoice History", to: "viewbills" },
                // { text: "GST Notice", to: "gstnoticea" },
                
              ]}
            />
          <SidebarItem
              icon={<ScanBarcode size={20}/>}
              text="Transactions"
              dropdownItems={[
                // { text: "Bills", to: "bills" },
                { text: "Transaction History", to: "transactionhistory" },
                { text: "Transaction Status", to: "transactionstatus" },
                // { text: "GST Notice", to: "gstnoticea" },
                
              ]}
            />
             <SidebarItem
              icon={<History size={20} />}
              text="History"
              to="historya"
            />
             <SidebarItem
              icon={<Files size={20}/>}
              text="Add Documents"
              dropdownItems={[
                { text: "GST Returns", to: "gstreturnsa" },
                { text: "IT Returns", to: "itreturnsa" },
                { text: "ROC Filings", to: "rocfilingsa" },
                // { text: "View IT Returns", to: "viewitreturnsa" },
                { text: "License", to: "licensea" },
                { text: "CMA Preparation", to: "cmaa" },
                { text: "GST Notice", to: "gstnoticea" },
                // { text: "View GST Notice", to: "viewgstnoticea" },
                // { text: "View GST Returns", to: "viewgstreturnsa" },
                // { text: "View ROC Filings", to: "viewrocfilingsa" },
                // { text: "View License", to: "viewlicensea" },
                // { text: "View CMA Preparation", to: "viewcmaa" },
                // { text: "Others", to: "othersa" },
              ]}
              />
             <SidebarItem
              icon={<Files size={20}/>}
              text="View Documents"
              dropdownItems={[
                // { text: "IT Returns", to: "itreturnsa" },
                { text: "View KYC", to: "viewkyc" },
                { text: "View GST Returns", to: "viewgstreturnsa" },
                { text: "View IT Returns", to: "viewitreturnsa" },
                // { text: "GST Notice", to: "gstnoticea" },
                // { text: "GST Returns", to: "gstreturnsa" },
                { text: "View ROC Filings", to: "viewrocfilingsa" },
                { text: "View License", to: "viewlicensea" },
                { text: "View CMA Preparation", to: "viewcmaa" },
                { text: "View GST Notice", to: "viewgstnoticea" },
                // { text: "ROC Filings", to: "rocfilingsa" },
                // { text: "License", to: "licensea" },
                // { text: "CMA Preparation", to: "cmaa" },
                // { text: "Others", to: "othersa" },
              ]}
              />
        

        <SidebarItem
              
              text="Add On Services"
              to="AddOnServices"
              icon={<BadgePlus size={20}/>}
              
              /> 
            <SidebarItem
              icon={<Settings size={20}/>}
              text="Settings"
              dropdownItems={[
                // { text: "Banner Settings", to: "banner-settings" },
                // { text: "Whatsapp Settings", to: "whatsapp-settings" },
                { text: "Email Settings", to: "email-settings" },
                { text: "Payment Settings", to: "payment-settings" },
                { text: "Banner Settings", to: "banner-settings" },
                { text: "IT Returns Settings", to: "itreturns-settings" },
                { text: "GST Returns Settings", to: "gstreturns-settings" },
                { text: "GST Notice Settings", to: "gstnotice-settings" },
                { text: "Company Settings", to: "company-settings" },
                { text: "CMA Preparation Settings", to: "cma-settings" },
                { text: "ROC Filings", to: "roc-settings" },
                { text: "License Settings", to: "license-settings" },
                { text: "Add On Services Settings", to: "addonservicessettings" },
                // { text: "Others", to: "othersa" },
              ]}
            />
      </Sidebar>
      </div>
  </div>
  );
};

export default Dashboard;