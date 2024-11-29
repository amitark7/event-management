import React, { useState } from "react";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: false, password: false });
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError((prevError) => ({ ...prevError, [e.target.name]: false }));
  };

  const handleClick = async () => {
    const newError = {
      email: loginData.email.trim() === "",
      password: loginData.password.trim() === "",
    };
    setError(newError);
    if (!newError.email && !newError.password) {
      try {
        const data = await signInWithEmailAndPassword(
          auth,
          loginData.email,
          loginData.password
        );
        console.log("Data --> ", loginData);
        console.log("Data --> ", data);
      } catch (error) {
        console.log("Error ---> ", error);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-pink-600">
      <div className="flex w-[80%] ">
        <div className="w-[50%]">
          <img
            src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?cs=srgb&dl=pexels-designecologist-1779487.jpg&fm=jpg"
            alt="image left"
          />
        </div>

        <div className="bg-white shadow-lg w-[50%] p-12">
          <div className="mb-6">
            <p className="text-gray-600">Welcome Back!</p>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border ${
                  error.email ? "border-red-400" : "border-gray-300"
                } rounded-lg outline-none`}
                onChange={handleChange}
                value={loginData.email}
              />
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type={isVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border ${
                  error.password ? "border-red-400" : "border-gray-300"
                } rounded-lg outline-none`}
                onChange={handleChange}
                value={loginData.password}
              />
              <div
                className="absolute top-11 right-3 cursor-pointer"
                onClick={() => setIsVisible(!isVisible)}
              >
                {!isVisible ? <RxEyeOpen /> : <GoEyeClosed />}
              </div>
            </div>
            <button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      {/* <p className="text-center text-gray-600 text-sm mt-6">
        © 2024 All rights reserved by{" "}
        <span className="font-bold text-purple-700">Chhatra National Club</span>
        .
      </p> */}
    </div>
  );
};

export default Login;
