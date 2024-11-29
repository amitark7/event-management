import React, { useEffect, useState } from "react";
import { RiCalendarEventLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../store/reducers/eventReducer";
import ConfimationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";

const Events = () => {
  const { events, loading, fetching } = useSelector((state) => state.events);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
  });
  const [error, setError] = useState({
    eventName: false,
    eventDate: false,
    eventTime: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageLimit, setPageLimit] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const entries_per_pages = ["5", "10", "15"];

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEventData({ ...eventData, [e.target.name]: e.target.value });
    setError((prevError) => ({ ...prevError, [e.target.name]: false }));
  };

  const handleOnFormClick = () => {
    const newError = {
      eventName: eventData.eventName.trim() === "",
      eventDate: eventData.eventDate.trim() === "",
      eventTime: eventData.eventTime.trim() === "",
    };
    setError(newError);

    if (!newError.eventName && !newError.eventDate && !newError.eventTime) {
      if (updateId) {
        dispatch(updateEvent({ eventData: eventData, id: updateId }))
          .then(() => {
            const updatedEvents = events.map((event) =>
              event.id === updateId ? { ...event, ...eventData } : event
            );
            dispatch({
              type: "events/updateEventsInState",
              payload: updatedEvents,
            });
            setUpdateId(null);
            setShowModal(true);
            setModalTitle("Record Updated Succesfully!");
          })
          .catch((error) => {
            console.error("Failed to update Event:", error);
          });
      } else {
        dispatch(addEvent(eventData))
          .then(() => {
            setShowModal(true);
            setModalTitle("Record Added Succesfully!");
          })
          .catch((error) => {
            console.error("Failed to add event:", error);
          });
      }
    }

    setEventData({
      eventName: "",
      eventDate: "",
      eventTime: "",
    });
  };

  const handleCancelClick = () => {
    setUpdateId(null);
    setEventData({
      eventName: "",
      eventDate: "",
      eventTime: "",
    });
  };

  const handleDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDeleteEvent = () => {
    dispatch(deleteEvent(deleteId))
      .then((response) => {
        if (response.type === "deleteEvents/fulfilled") {
          setShowDeleteModal(false);
          setDeleteId(null);
          setShowModal(true);
          setModalTitle("Record Deleted Successfully!");
          if (updateId) {
            setUpdateId(null);
            setEventData({
              eventName: "",
              eventDate: "",
              eventTime: "",
            });
          }
        } else {
          console.error("Delete failed:", response.payload);
        }
      })
      .catch((error) => {
        console.error("Unhandled error:", error);
        setShowModal(false);
      });
  };

  const handleUpdate = (data) => {
    setUpdateId(data.id);
    setEventData({
      eventName: data.eventName,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
    });
  };

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-between p-4">
      <div className="flex flex-col justify-between w-full bg-white">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Add Events</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
          <div className="w-full">
            <label htmlFor="eventName" className="text-gray-500">
              Event Name
            </label>
            <input
              type="text"
              placeholder="Event Name"
              id="eventName"
              name="eventName"
              className={`w-full p-2 border ${
                error.eventName ? "border-red-400" : ""
              } outline-none`}
              value={eventData.eventName}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-[90%]">
            <label htmlFor="eventDate" className="text-gray-500">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              className={`w-full p-2 border ${
                error.eventDate ? "border-red-300" : ""
              } outline-none`}
              value={eventData.eventDate}
              onChange={handleOnChange}
            />
          </div>
          <div className="w-[90%]">
            <label htmlFor="eventName" className="text-gray-500">
              Event Time
            </label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              value={eventData.eventTime}
              className={`w-full p-2 border ${
                error.eventTime ? "border-red-500" : ""
              } outline-none`}
              onChange={handleOnChange}
            />
          </div>
          <div className="flex items-end">
            <button
              className={`flex ${
                loading ? "flex-row-reverse" : "flex-row"
              } items-center w-[160px] bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer`}
              onClick={handleOnFormClick}
            >
              <span className="bg-indigo-500 rounded-full p-3">
                <RiCalendarEventLine size={20} color="white" />
              </span>
              <span className="p-2 text-white hover:text-black">
                {loading ? "Loading" : updateId ? "Update Event" : "Add Event"}
              </span>
            </button>
            {updateId && (
              <button
                className="flex items-center w-[100px] ml-1 cursor-pointer bg-indigo-600 rounded-full hover:bg-indigo-400 cursor-pointer"
                onClick={handleCancelClick}
              >
                <span className="bg-indigo-500 rounded-full p-3">
                  <TiDeleteOutline size={20} color="white" />
                </span>
                <span className="text-white hover:text-black">Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full bg-white mt-8">
        <div className="border-b p-6">
          <h1 className="text-xl text-gray-700 font-bold">Events List</h1>
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
                  Event Name
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Event Date
                </th>
                <th className="border text-sm sm:text-base px-1 sm:px-4 py-2">
                  Event Time
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
                currentItems.map((event, index) => (
                  <tr key={index}>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {event.eventName}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {event.eventDate}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      {event.eventTime}
                    </td>
                    <td className="border text-xs sm:text-sm md:text-base px-1 sm:px-4 py-4">
                      <div className="flex w-full items-center justify-center gap-2">
                        <div
                          className="bg-indigo-700 p-2 cursor-pointer"
                          onClick={() => handleUpdate(event)}
                        >
                          <GoPencil size={18} color="white" />
                        </div>
                        <div
                          className="bg-red-400 p-2 cursor-pointer"
                          onClick={() => handleDeleteModal(event.id)}
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
          onBtnOkClick={handleDeleteEvent}
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

export default Events;
