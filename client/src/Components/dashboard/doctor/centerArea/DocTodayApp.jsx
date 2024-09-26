import { useEffect, useState, useCallback } from "react";
import Table from "../../../common/Table";
import useDocCall from "../../../../Hooks/useDocCall";
import { useSelector } from "react-redux";
import Modal from "../../../common/Modal";
import { FaCalendarTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DocTodayApp = () => {
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getStatusLabel = (status) => {
    const capitalizedStatus = capitalizeFirstLetter(status);

    switch (status) {
      case "pending":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {capitalizedStatus}
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-700 dark:text-red-300">
            {capitalizedStatus}
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            {capitalizedStatus}
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {capitalizedStatus}
          </span>
        );
    }
  };

  const { getTodayAppointments, cancelAppointment, rescheduleAppointment } =
    useDocCall();
  const doctorId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState("");

  const columns = [
    { Header: "Patient's Name", accessor: "name" },
    { Header: "Time", accessor: "time" },
    { Header: "Location", accessor: "location" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "button" },
  ];

  const fetchAppointments = useCallback(async () => {
    const { appointments: docApps } = await getTodayAppointments(doctorId);
    console.log("Fetched Appointments:", docApps);

    if (Array.isArray(docApps)) {
      const formattedData = docApps.map((appointment) => ({
        ...appointment,
        name: `${appointment.patient.firstname} ${appointment.patient.lastname}`,
        time: appointment.appointmentTime || "N/A",
        location: appointment.appointmentLocation || "N/A",
        status: getStatusLabel(appointment.appointmentStatus),
        button: () => (
          <div className="space-x-2">
            <button
              className="bg-gray-200 text-gray-600 px-2 py-1 rounded"
              onClick={() => handleCancellation(appointment)}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => handleReschedule(appointment)}
            >
              Reschedule
            </button>
          </div>
        ),
      }));

      setAppointments(formattedData);
    } else {
      console.error("Expected an array but got:", docApps);
    }
  }, [doctorId, getTodayAppointments]);

  const handleCancellation = async (appointment) => {
    console.log(appointment);
    const postData = {
      patientId: appointment.patient._id,
      doctorId: doctorId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
    };

    const cancelRes = await cancelAppointment(postData);

    if (cancelRes) await fetchAppointments();
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    const postData = {
      patientId: selectedAppointment.patient._id,
      doctorId: doctorId,
      oldAppointmentDate: selectedAppointment.appointmentDate,
      oldAppointmentTime: selectedAppointment.appointmentTime,
      newAppointmentDate: newDate,
      newAppointmentTime: newTime,
    };

    const rescheduleRes = await rescheduleAppointment(postData);

    if (rescheduleRes) {
      await fetchAppointments();
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Today Appointments</h1>
      {appointments.length > 0 ? (
        <Table columns={columns} data={appointments} />
      ) : (
        <div className="flex flex-col rounded-2xl space-y-4 p-20 items-center justify-center bg-white">
          <FaCalendarTimes className="text-3xl" />
          <h2 className="text-2xl">No Appointments for Today</h2>
          <button
            className="font-sans flex justify-center gap-2 items-center mx-auto shadow-xl text-lg text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50before:aspect-square before:hover:scale-150 before:hover:duration-700 relative px-4 py-2 overflow-hidden border-2 rounded-full group"
            type="submit"
            onClick={() => setIsNewAppModalOpen(true)}
          >
            Add one?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 19"
              className="w-8 h-8 justify-end bg-gray-50 group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
            >
              <path
                className="fill-gray-800 group-hover:fill-gray-800"
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              ></path>
            </svg>
          </button>
        </div>
      )}

      <Modal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        title="New Appointment"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">New Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block mb-2">New Time:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleRescheduleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Appointment
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title="Reschedule Appointment"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">New Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block mb-2">New Time:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleRescheduleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm Reschedule
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DocTodayApp;
