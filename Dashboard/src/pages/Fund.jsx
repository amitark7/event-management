import React, { useEffect, useState } from "react";
import { TbCash } from "react-icons/tb";
import { BsCurrencyRupee } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";
import { GoDownload } from "react-icons/go";
import ConfimationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  addFund,
  deleteFund,
  getFundList,
  updateFund,
} from "../store/reducers/fundReducer";

const Fund = () => {
  const [pageLimit, setPageLimit] = useState(5);
  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fundData, setFundData] = useState({
    name: "",
    address: "",
    amount: "",
    date: "",
  });
  const [error, setError] = useState({
    name: false,
    address: false,
    amount: false,
    date: false,
  });
  const dispatch = useDispatch();
  const { loading, fundList, fetching } = useSelector((state) => state.funds);

  const entries_per_pages = ["5", "10", "15"];

  const filteredEvents = fundList.filter((fund) =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / pageLimit);
  const startIndex = (pageNumber - 1) * pageLimit;
  const currentItems = filteredEvents.slice(startIndex, startIndex + pageLimit);

  const handleChangePerPage = (e) => {
    setPageLimit(parseInt(e.target.value, 10));
    setPageNumber(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(1);
  };

  const handleOnChange = (e) => {
    setFundData({ ...fundData, [e.target.name]: e.target.value });
    setError((prevError) => ({ ...prevError, [e.target.name]: false }));
  };

  const handleUpdate = (fund) => {
    setUpdateId(fund.id);
    setFundData({
      name: fund.name,
      address: fund.address,
      amount: fund.amount,
      date: fund.date,
    });
  };

  const handleDownload = (fund) => {
    console.log("Fund ---> ", fund);
  };

  const handleClick = () => {
    const newError = {
      name: fundData.name.trim() === "",
      address: fundData.address.trim() === "",
      amount: fundData.amount.trim() === "",
      date: fundData.date.trim() === "",
    };

    setError(newError);
    if (
      !newError.name &&
      !newError.address &&
      !newError.amount &&
      !newError.date
    ) {
      if (updateId) {
        dispatch(updateFund({ id: updateId, fundData }))
          .then((response) => {
            if ((response.type = "updateFund/fulfilled")) {
              setShowModal(true);
              setUpdateId(null);
              setModalTitle("Fund Updated Succesfully!");
              resetForm();
            } else {
              console.log("Error --> ", response.payload);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        dispatch(addFund(fundData))
          .then((response) => {
            if (response.type === "addFund/fulfilled") {
              setShowModal(true);
              setModalTitle("Fund Added Succesfully!");
              resetForm();
            } else {
              setError(true);
              console.error("Addition failed:", response.payload);
            }
          })
          .catch((error) => {
            console.error("Unhandled error:", error);
            setShowModal(false);
          });
      }
    }
  };

  const resetForm = () => {
    setFundData({
      name: "",
      address: "",
      amount: "",
      date: "",
    });
  };

  const handleCancelClick = () => {
    setUpdateId(null);
    resetForm();
  };

  const handleDelete = () => {
    try {
      dispatch(deleteFund(deleteId)).then((response) => {
        if (response.type === "deleteFund/fulfilled") {
          setShowDeleteModal(false);
          setDeleteId(null);
          setShowModal(true);
          setModalTitle("Fund Deleted Succesfully!");
          if (updateId) {
            setUpdateId(null);
            resetForm();
          }
        } else {
          console.error("Error --> ", response.payload);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    dispatch(getFundList());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-between p-4">
      <div className="flex flex-col justify-between w-full bg-white">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Add Fund</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5">
          <div className="w-full">
            <label htmlFor="name" className="text-gray-500">
              Name
            </label>
            <input
              type="text"
              placeholder="Depositor Name"
              id="name"
              name="name"
              className={`w-full p-2 border ${
                error.name ? "border-red-400" : ""
              } outline-none`}
              value={fundData.name}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="address" className="text-gray-500">
              Address
            </label>
            <input
              type="text"
              placeholder="Address"
              id="address"
              name="address"
              className={`w-full p-2 border ${
                error.address ? "border-red-400" : ""
              } outline-none`}
              value={fundData.address}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="amount" className="text-gray-500">
              Fund Amount
            </label>
            <input
              type="text"
              placeholder="Fund Amount"
              id="amount"
              name="amount"
              className={`w-full p-2 border ${
                error.amount ? "border-red-400" : ""
              } outline-none`}
              value={fundData.amount}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="date" className="text-gray-500">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={`w-full p-2 border ${
                error.date ? "border-red-300" : ""
              } outline-none`}
              value={fundData.date}
              onChange={handleOnChange}
            />
          </div>
          <div className="flex items-end">
            <button
              className={`flex items-center ${
                loading ? "flex-row-reverse" : "flex-row"
              } w-[160px] bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer animation`}
              onClick={handleClick}
            >
              <span className="bg-indigo-500 rounded-full p-3">
                <TbCash size={20} color="white" />
              </span>
              <span className="p-2 text-white hover:text-black">
                {loading ? "Loading..." : updateId ? "Update Fund" : "Add Fund"}
              </span>
            </button>
            {updateId && (
              <button
                className="flex items-center w-[120px] ml-1 cursor-pointer bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer"
                onClick={handleCancelClick}
              >
                <span className="bg-indigo-500 rounded-full p-3">
                  <TiDeleteOutline size={20} color="white" />
                </span>
                <span className="text-white ml-1 hover:text-black">Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full bg-white mt-8">
        <div className="border-b flex justify-between p-6">
          <h1 className="text-xl text-gray-700 font-bold">Fund List</h1>
          <h1 className="text-xl text-gray-700 flex items-center">
            <span>Total Fund Amount - </span>
            <span className="flex items-center text-green-500">
              <BsCurrencyRupee size={20} />{" "}
              {fundList.reduce(
                (sum, fund) => sum + parseInt(fund.amount, 0),
                0
              )}
            </span>
          </h1>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="mb-4 text-sm sm:text-base flex items-center">
              <label htmlFor="perPage">Entries per page:</label>
              <select
                id="perPage"
                value={pageLimit}
                onChange={handleChangePerPage}
                className="ml-2 border rounded px-1 py-1"
              >
                {entries_per_pages.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="search" className="text-gray-500 font-semibold">
                Search:{" "}
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="border-2 outline-none pl-1"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <table className="w-full mt-4 text-left border">
            <thead>
              <tr>
                <th className="border text-sm sm:text-base px-4 sm:px-4 py-2">
                  SR No.
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Name
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Address
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Amount
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Date
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-lg py-6 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-lg py-6 text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                currentItems.map((fund, index) => (
                  <tr key={index}>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {fund.name}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {fund.address}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {fund.amount}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {fund.date}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <div className="flex w-full items-center justify-center gap-2">
                        <div
                          className="bg-green-600 p-2 cursor-pointer"
                          onClick={() => handleDownload(fund)}
                        >
                          <GoDownload size={18} color="white" />
                        </div>
                        <div
                          className="bg-indigo-700 p-2 cursor-pointer"
                          onClick={() => handleUpdate(fund)}
                        >
                          <GoPencil size={18} color="white" />
                        </div>
                        <div
                          className="bg-red-400 p-2 cursor-pointer"
                          onClick={() => handleDeleteModal(fund.id)}
                        >
                          <MdDelete size={18} color="white" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1>
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + currentItems.length,
                  filteredEvents.length
                )}{" "}
                of {filteredEvents.length} entries
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 1}
                className={`text-black w-[90px] text-xs sm:text-base cursor-pointer border p-2 transition duration-200`}
              >
                Previous
              </button>
              <div className="text-xs w-[40px] text-center sm:text-base bg-indigo-700 border border-indigo-700 text-white py-2">
                {pageNumber}
              </div>
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={totalPages === pageNumber}
                className={`text-black text-xs w-[90px] sm:text-base border cursor-pointer p-2 transition duration-200`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <ConfimationModal
          btnOkText={"Delete"}
          btnCancelText={"Cancel"}
          onBtnCancleClick={() => setShowDeleteModal(false)}
          modalTitle={"Delete"}
          modalSubTitle={"Are You Sure? you want delete this item "}
          onBtnOkClick={handleDelete}
          btnColor={"bg-red-500"}
        />
      )}
      {showModal && (
        <Modal
          modalTitle={modalTitle}
          handleClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Fund;
