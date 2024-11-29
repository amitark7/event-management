import React from "react";
import doneJson from "../lottie/doneJson.json";
import { Player } from "@lottiefiles/react-lottie-player";

const Modal = ({ modalTitle, handleClick }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-10">
      <div className="modal-overlay fixed inset-0 bg-gray-500 opacity-50"></div>
      <div className="modal-container bg-white md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto flex flex-col items-center">
        <div className="modal-content w-[500px] pb-4 text-left">
          <div className="h-[150px] w-[170px] justify-self-center">
            <Player
              autoplay={true}
              loop={true}
              width={150}
              height={150}
              src={doneJson}
            />
          </div>
          <p className="mb-3 text-center text-xl">{modalTitle}</p>
          <div className="w-full text-center">
            <button
              className="bg-indigo-700 py-2 px-6 text-center text-white"
              onClick={handleClick}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
