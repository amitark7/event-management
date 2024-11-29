import React from "react";
import { Link } from "react-router-dom";

const Card = ({ list }) => {
  return (
    <Link
      to={list.path}
      className=" bg-white hover:-translate-y-1 duration-300 hover:shadow-2xl"
    >
      <div className="p-6 flex justify-between items-center  rounded-xl">
        <h1 className="text-xl font-semibold">{list.name}</h1>
        <div className={`bg-${list.color}-200 py-3 px-3`}>
          <list.icon size={24} color={list.color} />
        </div>
      </div>
    </Link>
  );
};

export default Card;
