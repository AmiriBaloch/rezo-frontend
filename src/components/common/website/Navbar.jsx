"use client";
import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiHeart,
  FiSettings,
  FiMessageSquare,
} from "react-icons/fi";
import { MdOutlineCompare } from "react-icons/md";
import { BiHomeAlt } from "react-icons/bi";
import Link from "next/link";

// import OwnerApplicationForm from "../../OwnerApplicationForm"; // Removed

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userData, setUserData] = useState(null);
  // const [showOwnerForm, setShowOwnerForm] = useState(false); // Removed

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUserData(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('profile-dropdown');
      const dropdownButton = document.getElementById('profile-dropdown-button');
      
      if (dropdown && dropdownButton && !dropdown.contains(event.target) && !dropdownButton.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const isLoggedIn = Boolean(userData);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      name: "Properties",
      path: "/properties",
    },
  ];

  const userFullName = `${userData?.firstName || ""} ${
    userData?.lastName || ""
  }`.trim();
  const userEmail = userData?.email || "";
  const avatarUrl = userData?.avatarUrl || null;

  return (
    <nav className="bg-secondary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" onClick={closeAllDropdowns}>
            <img src="/Logo/logo.png" alt="Logo" className="w-14" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-700 hover:text-primary transition"
                    onClick={closeAllDropdowns}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    id="profile-dropdown-button"
                    className="flex items-center space-x-2 hover:text-primary transition"
                    onClick={() => toggleDropdown("profile")}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
                          {userFullName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700">
                      {userFullName || "User"}
                    </span>
                    <FiChevronDown
                      className={`transition-transform ${
                        activeDropdown === "profile" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === "profile" && (
                    <ul id="profile-dropdown" className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-1 z-50">
                      <li className="px-4 py-3 border-b flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
                              {userFullName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {userFullName || "User"}
                          </p>
                          <p className="text-sm text-gray-500">{userEmail}</p>
                        </div>
                      </li>
                      <li>
                        <Link
                          href="/account-settings"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={closeAllDropdowns}
                        >
                          <FiSettings className="mr-2" />
                          <span>Account Settings</span>
                        </Link>
                      </li>


                      <li>
                        <Link
                          href="/messages"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={closeAllDropdowns}
                        >
                          <FiMessageSquare className="mr-2" />
                          <span>Messages</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left flex items-center px-4 py-2 text-secondary hover:bg-gray-100"
                          onClick={() => {
                            localStorage.removeItem("user");
                            setUserData(null);
                            closeAllDropdowns();
                          }}
                        >
                          <FiLogOut className="mr-2" />
                          <span>Sign Out</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition"
                  onClick={closeAllDropdowns}
                >
                  <FiUser />
                  <span>Register / Login</span>
                </Link>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <ul className="flex flex-col space-y-2 px-4 py-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-700 hover:text-primary block"
                    onClick={closeAllDropdowns}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="flex items-center text-gray-700 hover:text-primary"
                      onClick={closeAllDropdowns}
                    >
                      <FiSettings className="mr-2" />
                      <span>Account</span>
                    </Link>
                  </li>
                                        

                  <li>
                    <Link
                      href="/messages"
                      className="flex items-center text-gray-700 hover:text-primary"
                      onClick={closeAllDropdowns}
                    >
                      <FiMessageSquare className="mr-2" />
                      <span>Messages</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="w-full text-left flex items-center text-secondary hover:text-red-600"
                      onClick={() => {
                        localStorage.removeItem("user");
                        setUserData(null);
                        closeAllDropdowns();
                      }}
                    >
                      <FiLogOut className="mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="flex items-center text-gray-700 hover:text-primary"
                    onClick={closeAllDropdowns}
                  >
                    <FiUser className="mr-2" />
                    <span>Register / Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/* {showOwnerForm && (
        <OwnerApplicationForm
          onClose={() => setShowOwnerForm(false)}
          onSuccess={() => { setShowOwnerForm(false); alert("Request submitted!"); }}
        />
      )} */}
    </nav>
  );
};

export default Navbar;
