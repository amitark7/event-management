import React from "react";
import { RiCalendarEventLine } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { TbUsers } from "react-icons/tb";
import { SiCashapp } from "react-icons/si";
import Card from "../components/Card";

const Home = () => {
  const lists = [
    {
      name: "Event",
      path: "events",
      icon: RiCalendarEventLine,
      color: "red",
    },
    {
      name: "Gallery",
      path: "gallery",
      icon: GrGallery,
      color: "green",
    },
    {
      name: "Members",
      path: "members",
      icon: TbUsers,
      color: "gray",
    },
    {
      name: "Funds",
      path: "funds",
      icon: SiCashapp,
      color: "green",
    },
    {
      name: "Expense",
      path: "expenses",
      icon: SiCashapp,
      color: "green",
    },
  ];

  return (
    // bg-gradient-to-r from-purple-500 to-pink-500
    <div className="p-5">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {lists && lists.map((list, index) => <Card key={index} list={list} />)}
      </div>
    </div>
  );
};

export default Home;
