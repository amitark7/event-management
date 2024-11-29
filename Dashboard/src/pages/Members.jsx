import React, { useEffect, useState } from "react";
import { LiaUsersSolid } from "react-icons/lia";
import ConfimationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteImage,
  getImageList,
  uploadImage,
} from "../store/reducers/galleryReducer";
import { MdDelete } from "react-icons/md";
import {
  addMember,
  deleteMember,
  getMemberList,
  updateMember,
} from "../store/reducers/memberReducer";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

const Members = () => {
  const [image, setImage] = useState("");
  const [pageLimit, setPageLimit] = useState(5);
  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberData, setMemberData] = useState({
    name: "",
    image: "",
    post: "",
    number: "",
  });
  const [error, setError] = useState({
    name: false,
    image: false,
    post: false,
    number: false,
  });
  const dispatch = useDispatch();
  const { loading, memberList, fetching } = useSelector(
    (state) => state.members
  );

  const entries_per_pages = ["5", "10", "15"];

  const filteredEvents = memberList.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
    setError((prevError) => ({ ...prevError, [e.target.name]: false }));
  };

  const handleUpdate = (member) => {
    setUpdateId(member.id);
    setMemberData({
      name: member.name,
      image: member.image,
      post: member.post,
      number: member.number,
    });
    const filename = document.querySelector(".file-name");
    filename.textContent = member.image;
  };

  const handleClick = () => {
    const newError = {
      name: memberData.name.trim() === "",
      image: memberData.image === "",
      post: memberData.post.trim() === "",
      number: memberData.number.trim() === "",
    };

    setError(newError);
    if (
      !newError.name &&
      !newError.image &&
      !newError.post &&
      !newError.number
    ) {
      if (updateId) {
        dispatch(updateMember({ id: updateId, memberData }))
          .then((response) => {
            if ((response.type = "updateMember/fulfilled")) {
              setShowModal(true);
              setUpdateId(null);
              setModalTitle("Member Updated Succesfully!");
              const filename = document.querySelector(".file-name");
              filename.textContent = "No file chosen";
              resetForm();
            } else {
              console.log("Error --> ", response.payload);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        dispatch(addMember(memberData))
          .then((response) => {
            if (response.type === "addMember/fulfilled") {
              setShowModal(true);
              setModalTitle("Member Added Succesfully!");
              const filename = document.querySelector(".file-name");
              filename.textContent = "No file chosen";
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
    setMemberData({
      name: "",
      image: "",
      post: "",
      number: "",
    });
  };

  const handleCancelClick = () => {
    setUpdateId(null);
    resetForm();
    const filename = document.querySelector(".file-name");
    filename.textContent = "No file chosen";
  };

  const handleDelete = () => {
    try {
      dispatch(deleteMember(deleteId)).then((response) => {
        if (response.type === "deleteMember/fulfilled") {
          setShowDeleteModal(false);
          setDeleteId(null);
          setModalTitle("Member Deleted Succesfully!");
          setShowModal(true);
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
    dispatch(getMemberList());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-between p-4">
      <div className="flex flex-col justify-between w-full bg-white">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Add Members</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5">
          <div className="w-full">
            <label htmlFor="memberName" className="text-gray-500">
              Member Name
            </label>
            <input
              type="text"
              placeholder="Member Name"
              id="memberName"
              name="name"
              className={`w-full p-2 border ${
                error.name ? "border-red-400" : ""
              } outline-none`}
              value={memberData.name}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="eventName" className="text-gray-500">
              Upload Image
            </label>
            <div
              className={`flex items-center space-x-4 border ${
                error.image ? "border-red-500" : ""
              }`}
            >
              <label
                htmlFor="image"
                className="bg-indigo-200 text-black px-4 py-2 cursor-pointer hover:bg-indigo-300 transition"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm file-name truncate max-w-[200px]">
                No file chosen
              </span>
              <input
                type="file"
                id="image"
                name="image"
                className="hidden"
                key={image ? image.name : ""}
                onChange={(e) => {
                  const fileInput = e.target;
                  const fileName = e.target.files[0]?.name || "No file chosen";
                  setMemberData({ ...memberData, image: e.target.files[0] });
                  const filename = document.querySelector(".file-name");
                  filename.textContent = fileName;
                  setError(false);
                  fileInput.value = "";
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="memberost" className="text-gray-500">
              Member Post
            </label>
            <input
              type="text"
              placeholder="Member Post"
              id="memberPost"
              name="post"
              className={`w-full p-2 border ${
                error.post ? "border-red-400" : ""
              } outline-none`}
              value={memberData.post}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="memberNum" className="text-gray-500">
              Member Number
            </label>
            <input
              type="text"
              placeholder="Member Number"
              id="memberNum"
              name="number"
              className={`w-full p-2 border ${
                error.number ? "border-red-400" : ""
              } outline-none`}
              value={memberData.number}
              onChange={handleOnChange}
            />
          </div>
          <div className="flex items-end">
            <button
              className={`flex items-center ${
                loading ? "flex-row-reverse" : "flex-row"
              } w-[180px] bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer animation`}
              onClick={handleClick}
            >
              <span className="bg-indigo-500 rounded-full p-3">
                <LiaUsersSolid size={20} color="white" />
              </span>
              <span className="p-2 text-white hover:text-black">
                {loading
                  ? "Loading..."
                  : updateId
                  ? "Update Member"
                  : "Add Member"}
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
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Members List</h1>
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
                  Member Name
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Member Image
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Member Post
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Member Number
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
                currentItems.map((member, index) => (
                  <tr key={index}>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {member.name}
                    </td>
                    <td className="border text-center text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <img
                        src={member.image}
                        alt="Member image"
                        className="w-[90px] h-[90px]"
                      />
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {member.post}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {member.number}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <div className="flex w-full items-center justify-center gap-2">
                        <div
                          className="bg-indigo-700 p-2 cursor-pointer"
                          onClick={() => handleUpdate(member)}
                        >
                          <GoPencil size={18} color="white" />
                        </div>
                        <div
                          className="bg-red-400 p-2 cursor-pointer"
                          onClick={() => handleDeleteModal(member.id)}
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

export default Members;
