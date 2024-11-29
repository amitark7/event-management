import React, { useEffect, useState } from "react";
import { IoImagesOutline } from "react-icons/io5";
import ConfimationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteImage,
  getImageList,
  uploadImage,
} from "../store/reducers/galleryReducer";
import { MdDelete } from "react-icons/md";

const Gallery = () => {
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);
  const [pageLimit, setPageLimit] = useState(5);
  const [deleteId, setDeleteId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, galleryList, fetching } = useSelector(
    (state) => state.gallery
  );

  const entries_per_pages = ["5", "10", "15"];
  const filteredEvents = galleryList.filter((gallery) =>
    gallery.image.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleClick = () => {
    if (!image) {
      setError(true);
    } else {
      dispatch(uploadImage(image))
        .then((response) => {
          if (response.type === "uploadImage/fulfilled") {
            setShowModal(true);
            setModalTitle("Image Added Succesfully!");
            const filename = document.querySelector(".file-name");
            filename.textContent = "No file chosen";
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
  };

  const handleDelete = () => {
    try {
      dispatch(deleteImage(deleteId)).then((response) => {
        if (response.type === "deleteImage/fulfilled") {
          setShowDeleteModal(false);
          setModalTitle("Image Deleted Succesfully!");
          setDeleteId(null);
          setShowModal(true);
        } else {
          console.error("Error --> ", response.error.message);
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
    dispatch(getImageList());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-between p-4">
      <div className="flex flex-col justify-between w-full bg-white">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Add New Image</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5">
          <div className="w-full">
            <label htmlFor="eventName" className="text-gray-500">
              Upload Image
            </label>
            <div
              className={`flex items-center space-x-4 border ${
                error ? "border-red-500" : ""
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
                  setImage(e.target.files[0]);
                  const filename = document.querySelector(".file-name");
                  filename.textContent = fileName;
                  setError(false);
                  fileInput.value = "";
                }}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              className={`flex items-center ${
                loading ? "flex-row-reverse" : "flex-row"
              } w-[160px] bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer animation`}
              onClick={handleClick}
            >
              <span className="bg-indigo-500 rounded-full p-3">
                <IoImagesOutline size={20} color="white" />
              </span>
              <span className="p-2 text-white hover:text-black">
                {loading ? "Loading..." : "Add Image"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full bg-white mt-8">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Gallery List</h1>
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
                  Gallery Image
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
                    colSpan="5"
                    className="text-center text-lg py-6 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-lg py-6 text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                currentItems.map((gallery, index) => (
                  <tr key={index}>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="border text-center text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <img
                        src={gallery.image}
                        alt="gallery image"
                        className="w-[90px] h-[90px]"
                      />
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <div className="flex w-full items-center justify-center gap-2">
                        <div
                          className="bg-red-400 p-2 cursor-pointer"
                          onClick={() => handleDeleteModal(gallery.id)}
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

export default Gallery;
