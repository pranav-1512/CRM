import React, { useState } from 'react';
import { LayoutDashboard,Bell,Ticket,CircleUserRound,ScanBarcode,History,UserPlus,BadgePlus,User,UserMinus,ReceiptIndianRupee,StickyNote,Files } from "lucide-react";
import { Sidebar, SidebarItem } from "./Sidebare";
const Dashboard = () => {
  return (
    <div>
      <div className="">
      <Sidebar>
      <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              to=""
              active
       />

        <SidebarItem
              icon={<CircleUserRound size={20} />}
              text="My Profile"
              to="myprofilee"
              
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
              icon={<Bell size={20} />}
              text="Notification"
              to="notificationse"
              
       /> 
         <SidebarItem
              icon={<StickyNote size={20} />}
              text="Reminder"
              to="reminderse"
         />
         <SidebarItem
              icon={<Ticket  size={20} />}
              text="Support Ticket"
              to="support-tickete"
              
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
                { text: "Transaction History", to: "transactionhistory" },
                { text: "Transaction Status", to: "transactionstatus" },
                // { text: "GST Notice", to: "gstnoticea" },
                
              ]}
            />

            
          <SidebarItem
              icon={<Files size={20}/>}
              text="Add Documents"
              dropdownItems={[
                { text: "GST Returns", to: "gstreturnse" },
                { text: "IT Returns", to: "itreturnse" },
                // { text: "View IT Returns", to: "viewitreturnse" },
                // { text: "View GST Notice", to: "viewgstnoticee" },
                // { text: "View GST Returns", to: "viewgstreturnse" },
                { text: "ROC Filings", to: "rocfilingse" },
                // { text: "View ROC Filings", to: "viewrocfilingse" },
                { text: "License", to: "licensee" },
                // { text: "View License", to: "viewlicensee" },
                { text: "CMA Preparation", to: "cmae" },
                { text: "GST Notice", to: "gstnoticee" },
                // { text: "View CMA Preparation", to: "viewcmae" },
              ]}
              
            />
          <SidebarItem
              icon={<Files size={20}/>}
              text="View Documents"
              dropdownItems={[
                // { text: "IT Returns", to: "itreturnse" },
                { text: "View KYC", to: "viewkyce" },
                { text: "View GST Returns", to: "viewgstreturnse" },
                { text: "View IT Returns", to: "viewitreturnse" },
                { text: "View ROC Filings", to: "viewrocfilingse" },
                // { text: "GST Notice", to: "gstnoticee" },
                { text: "View License", to: "viewlicensee" },
                { text: "View CMA Preparation", to: "viewcmae" },
                { text: "View GST Notice", to: "viewgstnoticee" },
                // { text: "GST Returns", to: "gstreturnse" },
                // { text: "ROC Filings", to: "rocfilingse" },
                // { text: "License", to: "licensee" },
                // { text: "CMA Preparation", to: "cmae" },
              ]}
              
            />

<SidebarItem
              
              text="Add On Services"
              to="AddOnServices"
              icon={<BadgePlus size={20}/>}
              
              /> 
            <SidebarItem
              icon={<History  size={20} />}
              text="History"
              to="history"
              
          />

      </Sidebar>
      </div>
  </div>
  );
};

export default Dashboard;