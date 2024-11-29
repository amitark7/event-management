import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { RiCalendarEventLine } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { TbUsers } from "react-icons/tb";
import { SiCashapp } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [activeLinks, setActiveLinks] = useState(0);

  const handleLinkClick = (index) => {
    setActiveLinks(index);
  };
  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Dashboard", icon: MdDashboard },
    { id: 2, path: "/events", name: "Events", icon: RiCalendarEventLine },
    { id: 3, path: "/gallery", name: "Gallery", icon: GrGallery },
    { id: 4, path: "/members", name: "Members", icon: TbUsers },
    { id: 5, path: "/funds", name: "Funds", icon: SiCashapp },
    { id: 6, path: "/expenses", name: "Expense", icon: SiCashapp },
  ];
  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r px-4 bg-white">
      <div className="mb-8 flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="w-[140px] hidden md:flex" />
      </div>

      <ul className="mt-6 space-y-6">
        {SIDEBAR_LINKS.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <li
              key={index}
              className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${
                isActive ? "bg-indigo-100 text-indigo-500" : ""
              }`}
            >
              <Link
                to={link.path}
                className="flex justify-center md:justify-start items-center md:space-x-5"
                onClick={() => handleLinkClick(index)}
              >
                <span>{link.icon()}</span>
                <span className="text-gray-500 hidden md:flex">
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer">
        <p className="flex items-center space-x-2 text-xs text-white py-2 px-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full">
          <span>?</span> <span className="hidden md:flex">Need Help </span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
