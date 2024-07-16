import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserSidebar, SidebarItem } from "./Sidebaru";
import {
  LayoutDashboard,
  CircleUserRound,
  Building2,
  BadgePlus,
  Files,
  ArrowUpLeft,
  Bell,
  StickyNote,
  Ticket,
  BadgeIndianRupee,
} from "lucide-react";

const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false); // Flag to show/hide dashboard
  const [showPayments, setShowPayments] = useState(false); // Flag to show/hide payment section
  const [unpaidBills, setUnpaidBills] = useState([]); // Holds unpaid bills data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment data for the client from the backend
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/user/viewBill",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (
          response.data &&
          response.data.temp &&
          response.data.temp.length > 0
        ) {
          // Map the received data to extract relevant information and calculate remaining time
          const now = Date.now(); // Current timestamp
          const newOrders = response.data.temp.map((bill) => {
            const dueDate = new Date(bill.duedate);
            const dueTime = new Date(bill.timestamp);
            dueDate.setHours(
              dueTime.getHours(),
              dueTime.getMinutes(),
              dueTime.getSeconds(),
              dueTime.getMilliseconds()
            );
            const dueTimeMs = dueDate.getTime();
            const remainingTime = dueTimeMs - now;
            return {
              _id: bill._id,
              amount: bill.amount,
              receipt: "receipt#" + bill._id,
              user: bill.userId,
              ispaid: bill.ispaid,
              duedate: bill.duedate,
              remainingTime: remainingTime > 0 ? remainingTime : 0, // Ensure remaining time is non-negative
            };
          });

          // Check if any unpaid bill has remaining time <= 0
          const hasExpiredPayment = newOrders.some(
            (payment) => payment.remainingTime <= 0 && !payment.ispaid
          );
          setShowDashboard(true);
          setShowPayments(hasExpiredPayment);
          setUnpaidBills(newOrders);
          console.log("yes");
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchData();
  }, []);

  // Render the component based on loading state and payment status
  return (
    <div>
      {
        <div className="">
          <UserSidebar>
            {/* Sidebar items */}
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              to=""
              active
            />
            {/* My Profile */}
            {!showPayments && (
              <SidebarItem
                icon={<CircleUserRound />}
                text="My Profile"
                to="myprofile"
              />
            )}
            {/* My Companies */}
            {!showPayments && (
              <SidebarItem
                icon={<Building2 />}
                text="My Companies"
                dropdownItems={[
                  { text: "Add Company", to: "add-company" },
                  { text: "View Company", to: "view-company" },
                ]}
              />
            )}
            {/* Notification */}
            {!showPayments && (
              <SidebarItem
                icon={<Bell size={20} />}
                text="Notification"
                to="notifications"
              />
            )}
            {/* Reminder */}
            {!showPayments && (
              <SidebarItem
                icon={<StickyNote size={20} />}
                text="Reminder"
                to="reminders"
              />
            )}
            {/* Support Ticket */}
            {!showPayments && (
              <SidebarItem
                icon={<Ticket size={20} />}
                text="Support Ticket"
                dropdownItems={[
                  { text: "Add Ticket", to: "add-ticket" },
                  { text: "View Ticket", to: "view-ticket" },
                ]}
              />
            )}
            {/* Payment section */}
            <SidebarItem
              icon={<BadgeIndianRupee size={20} />}
              text="Payments"
              dropdownItems={[
                { text: "Payments", to: "payments" },
                { text: "Payment History", to: "payment-history" },
              ]}
            />
            {/* Add Documents */}
            {!showPayments && (
              <SidebarItem
                icon={<Files size={20} />}
                text="My Documents"
                dropdownItems={[
                  { text: "KYC", to: "KYC" },
                  { text: "GST Registration", to: "gstregistration" },
                  { text: "GST Returns", to: "gstreturns" },
                  { text: "IT Returns", to: "itreturns" },
                  { text: "ROC Filings", to: "rocfilings" },
                  { text: "License", to: "license" },
                  { text: "CMA Preparation", to: "cma" },
                  { text: "GST Notice", to: "gstnotice" },
                  // { text: "Others", to: "othersa" },
                ]}
              />
            )}
            {/* Add On Services */}
            {!showPayments && (
              <SidebarItem
                icon={<BadgePlus size={20} />}
                text="Add On Services"
                dropdownItems={[
                  { text: "Request Services", to: "AddOnServices" },
                  { text: "View Requested Services", to: "viewAddOnServices" },
                ]}
              />
            )}
            {/* Other sidebar items */}
          </UserSidebar>
          {/* Other dashboard details */}
          {/* ... */}
        </div>
      }
    </div>
  );
};

export default Dashboard;
