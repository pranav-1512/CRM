import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function NavigationBar({ sidebarExpanded }) {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sstaxmentors-server.vercel.app/admin/navigation/emailname",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await axios.post(
        "https://sstaxmentors-server.vercel.app/admin/navigation/logout",
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
      navigate("/");
      console.error("Error:", error);
    }
  };

  return (
    <nav
      className="bg-white text-gray-800 py-4 px-6 lg:py-6 lg:px-12 w-full top-0 z-10"
      style={{ position: "sticky", top: 0 }}
    >
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex items-center ml-auto">
          <FiUser className="h-6 w-6 mr-2" style={{ color: "#3c82f6" }} />
          <h6 className="font-semibold mr-4">{userData.Name}</h6>
          <div
            ref={dropdownRef}
            className="relative inline-block text-left"
            style={{ zIndex: 100 }}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex justify-center rounded-md shadow-sm px-1 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <FiChevronDown className="h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  <div
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    {userData.email}
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
