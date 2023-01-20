import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import logo from "../assets/UG_logo_RGB_sygnet_negatyw_biały.svg";
import logo_black from "../assets/UG_logo_RGB_sygnet_pozytyw_achromatyczny.svg";
import { FiUser } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { TfiStatsUp } from "react-icons/tfi";
import { themeChange } from "theme-change";
import { useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storageTheme = localStorage.getItem("theme");
  if (!storageTheme) {
    localStorage.setItem("theme", "dark");
  }
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const { user } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <nav className="navbar border-b bordered border-base-300 bg-base-100 mb-5">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <img
            src={theme === "dark" ? logo : logo_black}
            className="h-36 mr-3 sm:h-36"
            alt="UG Logo"
          />
          <span className="self-center text-xl font-semibold ">
            Frequently Asked Questions
          </span>
        </Link>

        <ul className="menu menu-horizontal flex items-center justify-center px-1 ">
          <li className="mx-2">
            <select
              className="select select-bordered w-32"
              onChange={(e) => setTheme(e.target.value || "dark")}
              data-choose-theme
            >
              <option value="">Theme</option>
              <option value="dark">Dark</option>
              <option value="lofi">Light</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </li>
          {user && (
            <li tabIndex={0} className="relative">
              <a>
                <FiSettings className="text-4xl" />
              </a>
              <ul className="p-2 border-base-300 bg-base-100 absolute right-0 border z-50">
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
                {user.admin && (
                  <li>
                    <Link to="/admin-stats">
                      <TfiStatsUp className="text-4xl mx-3" />
                      Stats
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
          )}
        </ul>
      </div>
    </nav>
  );
}
