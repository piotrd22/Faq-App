import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import logo from "../assets/UG_logo_RGB_sygnet_negatyw_biały.svg";
import { FiUser } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mb-2">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-36 mr-3 sm:h-36" alt="Flowbite Logo" />
          <span className="self-center text-xl font-semibold dark:text-white">
            Frequently Asked Questions
          </span>
        </Link>
        {user && (
          <ul className="menu menu-horizontal px-1">
            <li tabIndex={0} className="relative">
              <a>
                <FiSettings className="text-4xl" />
              </a>
              <ul className="p-2 bg-base-100 absolute right-0">
                <li>
                  <Link to="/profile">
                    <FiUser className="text-4xl mx-3" />
                    Profile
                  </Link>
                </li>
                {user.admin && (
                  <li>
                    <Link to="/admin-panel">
                      <FiUsers className="text-4xl mx-3" />
                      Users
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={logoutHandler}>
                    <FiLogOut className="text-4xl mx-3 cursor-pointer" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
