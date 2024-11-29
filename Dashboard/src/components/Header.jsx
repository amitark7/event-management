import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
import { signOut } from "firebase/auth";

const Header = () => {
  const location = useLocation();
  const [isModal, setIsModal] = useState(false);

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((value, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      return (
        <span key={routeTo} className="flex items-center text-sm capitalize">
          Home
          <MdOutlineKeyboardArrowRight size={18} />
          {value}
        </span>
      );
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const currentTitle =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.split("/").pop();

  return (
    <>
      <div className="flex justify-between items-center relative sticky top-0 z-10 bg-white">
        <div className="p-5">
          <h1 className="text-xs">Welcome Back !</h1>
          <p className="text-xl font-semibold">Admin</p>
        </div>

        <div
          className="flex items-center w-[280px] mr-4 py-6 px-4 border-l border-r gap-1 cursor-pointer relative"
          onClick={() => setIsModal((prev) => !prev)}
        >
          <div>
            <FaRegUserCircle size={36} />
          </div>
          <div>{JSON.parse(localStorage.getItem("auth")).email}</div>

          {isModal && (
            <div className="absolute top-full w-[150px] bg-gray-300 right-0 shadow-lg">
              <a className="flex items-center gap-1 py-3 pl-4 border-b cursor-pointer">
                <MdDashboard />
                <span>Dashboard</span>
              </a>
              <a className="flex items-center gap-1 py-3 pl-4 border-b cursor-pointer">
                <IoHomeOutline />
                <span>Website</span>
              </a>
              <p
                className="flex items-center gap-1 py-3 pl-4 cursor-pointer"
                onClick={handleLogout}
              >
                <MdLogout />
                <span>Logout</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-t border-b px-5 py-3 bg-white flex justify-between items-center">
        <h1 className="font-bold capitalize">{currentTitle}</h1>
        <div className="flex items-center w-[120px]">
          {location.pathname === "/" ? (
            <span className="flex items-center text-sm capitalize">
              Home
              <MdOutlineKeyboardArrowRight size={18} />
              Dashboard
            </span>
          ) : (
            getBreadcrumbs()
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
